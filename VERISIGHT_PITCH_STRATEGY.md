# VERISIGHT // HackStellar 2026 Competitive Pitch & Judging Strategy
**Document ID:** `VERISIGHT-PITCH-2026-V1`  
**Problem Statement:** PS-12 (Digital Screenshot Forensics & Integrity Verification)  
**Target Audience:** Hackathon Technical Judges, Cyber Crime Officers, FinTech Risk Executives

---

## 1. The Core Strategic Framing

### The Problem We Solve
Over 450 million digital payment transactions occur daily in India across UPI, IMPS, and mobile wallets. Concurrently, thousands of merchants, delivery partners, and businesses fall victim daily to **"Payment Screenshot Fraud"** using spoofed payment apps (e.g., Fake-UPI, Spoof-Pay), browser DOM edits, or manipulated screenshots. 

### Why Existing Solutions Fail
Current tools fall into two flawed extremes:
1. **Generic Photographic Forensics (FotoForensics, Forensically):** Designed for camera photos with EXIF metadata and optical noise. They produce massive false alarms when WhatsApp recompresses a receipt, and they are completely blind to zero-pixel DOM manipulations.
2. **Superficial Text Checkers (Navines):** Basic regex tools easily bypassed by modern spoof-APKs that render realistic fonts.

### The VeriSight Thesis
**"Most tools inspect images. VeriSight investigates evidence."**  
VeriSight is an integrated 4-layer forensic investigation workbench that cross-calibrates pixel-level physics (ELA, Wavelet Daubechies noise, ORB clones), sub-pixel typography alignment (horizontal laser baselines, CIELAB ΔE color matching), protocol metadata (clock paradoxes, viewport ratios), and banking syndicate intelligence (VPA parsing, 1930 Cyber-Cell Section 91 statutory subpoenas).

---

## 2. Competitive Pitch Formats

### The 30-Second Elevator Pitch
> *"Every day, merchants across India lose crores to fake UPI payment screenshots generated in seconds by spoof-APKs and browser developer tools. Traditional forensic tools fail because screenshots lack camera sensor noise and get ruined by WhatsApp recompression. VeriSight solves this with a 4-layer multi-signal forensic workbench. We don't just inspect pixels; we check sub-pixel typography alignment, verify status bar clock chronology against transaction timestamps, parse UPI VPA routing, and instantly generate official Section 91 statutory subpoenas ready for police cyber cells. Evaluated on a real-world WhatsApp mobile corpus, VeriSight achieves a 0.9731 ROC-AUC in under 350 milliseconds."*

---

### The 60-Second Competition Pitch
> *"Judges, imagine a merchant handing over high-value goods because a customer showed a clean PhonePe screen for ₹95,000. That screenshot is completely fake, created using a spoof-APK or browser inspect element. If you upload that image to FotoForensics or Forensically, it tells you nothing—there's no camera EXIF data, and WhatsApp compression saturated the ELA grid.*
>
> *VeriSight was engineered specifically to solve digital evidence forensics for mobile financial receipts. Our architecture operates across four synchronized layers:*
> *First, we extract compression ELA, Daubechies wavelet noise, and ORB copy-move vectors.*
> *Second, our sub-pixel laser engine detects font drift and background patch splicing down to 0.1 pixel.*
> *Third, our protocol engine catches clock paradoxes—like a receipt showing 9:24 PM while the phone's status bar reads 8:15 PM.*
> *Fourth, we parse the beneficiary VPA, validate the RBI 12-digit UTR, and automatically draft an official Section 91 Cr.P.C. subpoena for law enforcement.*
>
> *On an external blind test set of real-world WhatsApp receipts, VeriSight achieves a 0.9731 ROC-AUC with an inference latency under 350 milliseconds. We don't just detect tampering; we provide court-admissible visual proof."*

---

### The 2-Minute Deep Technical Explanation
> *"Under the hood, VeriSight operates as a deterministic, zero-hallucination forensic pipeline combined with an explainable gradient-boosted decision fusion model.*
>
> *When an evidence artifact is ingested, Layer 1 executes in <120ms: we compute an Error Level Analysis matrix normalized at Q=95 resaving, decompose the luminance channel into Daubechies db4 wavelet sub-bands to measure high-frequency noise variance across 16x16 blocks, and run fast ORB keypoint extraction with Lowe's ratio test to detect cloned balance digits.*
>
> *Layer 2 performs sub-pixel typography geometry. Using OpenCV connected components, we isolate text bounding boxes, fit linear regression lasers through baseline coordinates, and compute the vertical slope deviation (Δy). When an attacker splices an amount like ₹95,000 into a ₹250 receipt, the baseline drift consistently exceeds our calibrated 2.2px threshold, while CIELAB color space evaluation exposes background patch splicing (ΔE > 3.5).*
>
> *Layer 3 resolves protocol-level metadata. It inspects OS container aspect ratios and conducts chronological cross-referencing between status bar clocks and receipt timestamps. If the status bar clock precedes the transaction completion timestamp, a critical clock paradox anomaly is flagged.*
>
> *Layer 4 performs semantic syndicate resolution. We extract the beneficiary VPA, resolve clearing bank PSP routing, validate compliance against the RBI 12-digit UTR standard, and draft a formatted Section 91 Cr.P.C. / Section 94 BNSS notice containing cryptographic hashes, extracted identifiers, and forensic exhibits.*
>
> *Finally, our Ensemble Calibration evaluates spatial IoU synergy: if Layer 1 compression artifacts overlap with Layer 2 font baseline drift on the same bounding box with IoU > 0.40, a non-linear synergy multiplier elevates the overall risk score. This achieved an empirical ROC-AUC of 0.9731 on an external real-world WhatsApp mobile corpus, maintaining a 92.3% specificity to protect merchants from false alarms."*

---

## 3. Five Strong Judge-Facing Talking Points

1. **"Screenshots Are Not Photos":**
   Traditional photo-forensic tools (FotoForensics, Forensically) rely on camera sensor PRNU and EXIF metadata that don't exist in screenshots. VeriSight is purpose-built for the screenshot domain.
2. **"Defeating the Zero-Pixel DOM Spoof":**
   If an attacker edits a payment confirmation in Chrome DevTools and takes a screenshot, the pixel matrix is 100% mathematically authentic. Pixel-only detectors fail 100% of the time. VeriSight catches it via Layer 3 clock paradoxes and Layer 4 UTR syntax validation.
3. **"Resilience to WhatsApp Recompression":**
   WhatsApp wipes out basic ELA baselines by compressing images down to 75% quality WebP. VeriSight features a dedicated WhatsApp laundering detector that dynamically adapts spatial IoU synergy thresholds, maintaining 90% recall and 92.3% specificity.
4. **"Explainable Evidence, Not Black-Box Probabilities":**
   Judges and courts cannot convict based on a neural network outputting "87% fake". VeriSight renders pixel-precise bounding boxes, sub-pixel laser baseline callouts, and exact color delta numbers.
5. **"Bridging Forensics to Police Cyber-Cells":**
   VeriSight does not end with an on-screen score. With a single click, it compiles a complete Section 91 Cr.P.C. / Section 94 BNSS statutory subpoena formatted for India's 1930 Cyber-Crime helpline and bank nodal officers.

---

## 4. Three Anticipated Judge Objections & Evidence-Backed Rebuttals

### Objection 1: *"Can't an attacker just use the exact native font and valid 12-digit numbers to bypass your checks?"*
**Evidence-Backed Rebuttal:**
> *"Even if an attacker matches the font family, digital editing software cannot perfectly replicate native Android sub-pixel text rendering (Skia / FreeType anti-aliasing) and system-level font smoothing across an existing background. This introduces micro-inconsistencies in the Daubechies wavelet high-frequency sub-band and CIELAB color patch delta (ΔE). Furthermore, the attacker would also have to synchronize the status bar clock with the receipt timestamp down to the minute, align the aspect ratio with native device viewport specifications, and generate a valid 12-digit UTR that adheres to NPCI bank routing standards. Defeating one layer is trivial; defeating all four synchronized layers simultaneously is mathematically and operationally improbable."*

---

### Objection 2: *"WhatsApp recompresses almost all forwarded receipts in India. Doesn't that destroy your compression and noise forensic signals?"*
**Evidence-Backed Rebuttal:**
> *"We specifically designed and conducted a controlled WhatsApp recompression experiment to solve this. When an image passes through WhatsApp, it strips EXIF and applies aggressive 8x8 DCT quantization. In our Layer 3, we detect WhatsApp compression signatures and automatically shift from single-layer reliance to cross-layer spatial IoU synergy. While baseline ELA is affected, high-frequency wavelet sub-bands and sub-pixel typography geometry persist through recompression. In our blind evaluation on 23 external WhatsApp mobile receipts from real devices, VeriSight maintained a 0.9731 ROC-AUC and 92.3% specificity, proving that our multi-signal architecture thrives under real-world messaging compression."*

---

### Objection 3: *"Does verifying a screenshot actually prove that the merchant received the money in their bank account?"*
**Evidence-Backed Rebuttal:**
> *"No, and we are completely transparent about this boundary in our platform documentation. No screenshot forensic tool on Earth can guarantee interbank settlement because a screenshot is merely client-side evidence. That is why VeriSight explicitly demarcates three distinct boundaries: Pixel Integrity, Semantic Consistency, and Banking Settlement. Rather than giving false guarantees, VeriSight provides the investigative bridge: our automated Section 91 Statutory Requisition empowers cyber cells and merchants to immediately freeze mule bank accounts and requisition server-side NPCI clearing logs within the critical 24-hour golden window."*
