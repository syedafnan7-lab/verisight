# Canonical Feature Schema Specification (v1.0.0)

**Project:** VeriSight Digital Payment Screenshot Forensics  
**Schema Identifier:** `CanonicalFeatureSchema`  
**Schema Version:** `1.0.0`  
**Status:** `VERIFIED` & `ENFORCED`  
**Last Updated:** 2026-11-11  

---

## 1. Executive Summary & Semantic Parity Resolution

In legacy implementations, feature extraction suffered from semantic divergence between offline training scripts (`ml/src/feature_extraction/extractor.py`) and live inference pipelines (`backend/app/services/forensic/pipeline.py`). Most critically, the feature previously labeled `cielab_delta_e` measured **text foreground-to-background contrast** ($\approx 124.0$ for dark glyphs on white cards) during training, but was defined at runtime as **local background patch discontinuity** ($\approx 0.0 - 5.0$). This discrepancy caused clean authentic images to suffer negative $z$-scores ($z \approx -7.54$), saturating the legacy logistic fusion model to a $99.999\%$ false-positive tampering probability ($1.000$).

Under **Canonical Feature Schema v1.0.0**, both training evaluation and live inference share a unified, validated 11-dimensional feature vector. The semantic meaning of each feature has been formally determined according to its actual forensic purpose.

### Forensic Semantic Determination for CIELAB Delta-E:
- **Decision:** **Definition B — Local Background Discontinuity Around Text Margins.**
- **Rationale:** Forensic payment tampering in digital screenshots (e.g., amount splicing or payee replacement) involves pasting cloned or digitally typed text with bounding-box background artifacts. Measuring the ink-to-paper text contrast merely measures font darkness and font weight, providing zero diagnostic value for digital forgery. The canonical metric `cielab_patch_delta_e` samples the outer margin around OCR text tokens (2–12 px) and measures perceptual color distance $\Delta E_{ab}^*$ against the reference card background. Clean receipts exhibit $\Delta E_{ab}^* \in [0.0, 2.5]$, whereas spliced patches exhibit localized halo boundaries with $\Delta E_{ab}^* > 2.5$.

---

## 2. Canonical 11-Dimensional Feature Specification

| Index | Feature Name | Units | Expected Range | Default (Missing) | Forensic Purpose |
|:---:|:---|:---:|:---:|:---:|:---|
| `0` | `ela_score` | Score (0–100) | $[0.0, 100.0]$ | `0.0` | Global JPEG compression error difference at $Q_{ref}=90$. |
| `1` | `ela_z_macroblocks` | Count | $[0.0, 500.0]$ | `0.0` | Contiguous $16 \times 16$ macroblocks exceeding $\mu_{ELA} + 2.6\sigma_{ELA}$. |
| `2` | `wavelet_void_score` | Score (0–100) | $[0.0, 100.0]$ | `0.0` | 2D Daubechies-4 DWT diagonal sub-band (HH) zero-noise void score. |
| `3` | `wavelet_min_variance` | Variance | $[0.0, 5.0]$ | `0.5` | Minimum local sliding $9 \times 9$ high-frequency wavelet variance. |
| `4` | `copy_move_vectors` | Count | $[0.0, 500.0]$ | `0.0` | Clustered parallel translation vectors from ORB keypoint matching. |
| `5` | `baseline_drift_px` | Pixels | $[0.0, 50.0]$ | `0.0` | Sub-pixel ordinary least squares (OLS) typographic baseline drift. |
| `6` | `cielab_patch_delta_e` | $\Delta E_{ab}^*$ | $[0.0, 50.0]$ | `0.0` | Perceptual color difference between token background margin and card background. |
| `7` | `cross_layer_iou` | IoU Ratio | $[0.0, 1.0]$ | `0.0` | Maximum geometric intersection-over-union between L1 signal & L2 typographic boxes. |
| `8` | `temporal_clock_paradox` | Boolean (0/1) | $\{0.0, 1.0\}$ | `0.0` | Status bar system clock earlier than recorded transaction timestamp. |
| `9` | `upi_utr_invalid` | Boolean (0/1) | $\{0.0, 1.0\}$ | `0.0` | Non-conformant NPCI 12-digit UTR syntax, checksum, or date encoding. |
| `10` | `whatsapp_transcoded` | Boolean (0/1) | $\{0.0, 1.0\}$ | `0.0` | Messaging proxy recompression signature (JPEG $Q \approx 77$, EXIF stripped). |

---

## 3. Detailed Mathematical & Algorithmic Definitions

### Feature 0: `ela_score`
- **Definition:** Quantifies global discrepancy between the input image and its recompressed counterpart at $Q_{ref}=90$ (or $Q_{ref}=75$ for WhatsApp).
  $$\mathbf{D}(x, y) = |\mathbf{I}(x, y) - \mathbf{I}_{JPEG}(x, y)|$$
- **Units:** Dimensionless scaled score $[0.0, 100.0]$.
- **Training Implementation:** `app.services.forensic.pixel_analysis.ela.run_ela_analysis`
- **Runtime Implementation:** `app.services.forensic.pixel_analysis.ela.run_ela_analysis`

### Feature 1: `ela_z_macroblocks`
- **Definition:** Number of $16 \times 16$ DCT blocks where mean residual error exceeds statistical threshold:
  $$\tau_{ELA} = \max\left(8.0, \; \mu_{blocks} + 2.6 \cdot \sigma_{blocks}\right)$$
- **Units:** Integer block count.

### Feature 2: `wavelet_void_score`
- **Definition:** Detects flat patched regions and cloning boundaries using discrete 2D Daubechies-4 wavelet transform.
  $$\mathbf{cD} = \text{DWT2}_{HH}(\mathbf{Y}_{luminance})$$
- **Units:** Dimensionless score $[0.0, 100.0]$.

### Feature 3: `wavelet_min_variance`
- **Definition:** The minimum variance across local $9 \times 9$ sliding windows in the high-frequency $\mathbf{cD}$ diagonal detail plane:
  $$\sigma_{local}^2(x, y) = \frac{1}{81} \sum_{u, v} \mathbf{cD}(x+u, y+v)^2 - \left(\frac{1}{81} \sum_{u, v} \mathbf{cD}(x+u, y+v)\right)^2$$
- **Units:** Variance units (luminance detail power).

### Feature 4: `copy_move_vectors`
- **Definition:** The number of clustered, parallel translation vectors between matched ORB feature keypoints $(\mathbf{p}_i, \mathbf{p}_j)$ where Euclidean translation $\|\mathbf{p}_i - \mathbf{p}_j\| > 30\text{px}$ and vector orientation variance $\sigma_\theta^2 < 0.08$.
- **Units:** Count of mutually consistent translation vectors.

### Feature 5: `baseline_drift_px`
- **Definition:** Maximum vertical residual deviation $r_i = |y_i - (\hat{m} x_i + \hat{c})|$ of OCR token baseline centroids relative to the Ordinary Least Squares (OLS) line fit across typographic rows:
  $$\hat{m} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}, \quad \hat{c} = \bar{y} - \hat{m}\bar{x}$$
- **Units:** Physical image pixels.

### Feature 6: `cielab_patch_delta_e`
- **Definition:** CIE76 Euclidean color distance in standard $L^*a^*b^*$ perceptual color space between token background margin $\mathbf{c}_{token}$ and reference card background $\mathbf{c}_{bg}$:
  $$\Delta E_{ab}^* = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}$$
- **Units:** CIELAB $\Delta E_{ab}^*$ units. Clean receipts: $\Delta E \in [0.0, 2.5]$; spliced receipts: $\Delta E > 2.5$.

### Feature 7: `cross_layer_iou`
- **Definition:** Maximum pairwise Intersection-over-Union between Layer 1 physical signal bounding boxes ($B_{L1}$) and Layer 2 typographic bounding boxes ($B_{L2}$):
  $$\text{IoU}(B_{L1}, B_{L2}) = \frac{\text{Area}(B_{L1} \cap B_{L2})}{\text{Area}(B_{L1} \cup B_{L2})}$$
- **Units:** Dimensionless overlap ratio in $[0.0, 1.0]$.

### Feature 8: `temporal_clock_paradox`
- **Definition:** Boolean indicator evaluated by OCR temporal comparison. Returns $1.0$ if the status bar clock time $T_{status}$ precedes the transaction timestamp $T_{tx}$, indicating fraudulent composite editing.
- **Units:** Binary indicator $\{0.0, 1.0\}$.

### Feature 9: `upi_utr_invalid`
- **Definition:** Boolean indicator evaluating NPCI 12-digit UTR structural validity. Returns $1.0$ if the UTR contains non-numeric characters, fails day-of-year prefix bounds ($DOY \in [001, 366]$), or fails gateway syntax checks.
- **Units:** Binary indicator $\{0.0, 1.0\}$.

### Feature 10: `whatsapp_transcoded`
- **Definition:** Boolean indicator evaluating whether the container demonstrates lossy messaging transcoding (JPEG compression tables matching WhatsApp Q=77, stripped EXIF, standardized resolution).
- **Units:** Binary indicator $\{0.0, 1.0\}$.

---

## 4. Input Dependencies & Missing Value Handling

1. **Missing / Unparsable Text:** If OCR fails to detect text tokens, `baseline_drift_px` defaults to `0.0`, `cielab_patch_delta_e` defaults to `0.0`, and `temporal_clock_paradox` defaults to `0.0`.
2. **Missing Metadata / EXIF:** If EXIF is stripped, `whatsapp_transcoded` is inferred from quantization table analysis and aspect ratio.
3. **Clamping & Validation:** All vectors are passed through `validate_and_format_feature_vector()`:
   - NaNs and Infs are replaced with defined defaults.
   - Values are strictly clamped to $[expected\_min, expected\_max]$.
   - Mismatched vector lengths ($\neq 11$) are rejected with an explicit validation error, triggering runtime heuristic fallback rather than silent model failure.
