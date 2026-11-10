"""
VeriSight Scientific Forensic Feature Extraction Pipeline.
Extracts 13 deterministic, interpretable physical and typographic measurements
from digital payment screenshots.
"""
from __future__ import annotations

import base64
import hashlib
from typing import Any

import cv2
import numpy as np
import pywt


class ForensicFeatureRecord:
    def __init__(
        self,
        name: str,
        value: float,
        source_method: str,
        region: list[int] | None = None,
        reliability: float = 1.0,
        availability: bool = True,
        error: str | None = None,
        evidence_reference: str = "",
    ):
        self.name = name
        self.value = value
        self.source_method = source_method
        self.region = region or [0, 0, 0, 0]  # [x, y, w, h]
        self.reliability = reliability
        self.availability = availability
        self.error = error
        self.evidence_reference = evidence_reference

    def to_dict(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "value": round(float(self.value), 4),
            "source_method": self.source_method,
            "region": self.region,
            "reliability": round(float(self.reliability), 3),
            "availability": self.availability,
            "error": self.error,
            "evidence_reference": self.evidence_reference,
        }


def extract_ela_features(img_bgr: np.ndarray, quality: int = 90) -> tuple[float, int, list[list[int]]]:
    """Computes Error Level Analysis difference and identifies anomalous 16x16 macroblocks."""
    h, w = img_bgr.shape[:2]
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
    _, encimg = cv2.imencode(".jpg", img_bgr, encode_param)
    resaved = cv2.imdecode(encimg, cv2.IMREAD_COLOR)

    diff = cv2.absdiff(img_bgr, resaved).astype(np.float32)
    gray_diff = cv2.cvtColor(diff.astype(np.uint8), cv2.COLOR_BGR2GRAY)

    block_size = 16
    n_blocks_y = h // block_size
    n_blocks_x = w // block_size

    if n_blocks_y == 0 or n_blocks_x == 0:
        return 0.0, 0, []

    block_stds = []
    blocks_coords = []
    for by in range(n_blocks_y):
        for bx in range(n_blocks_x):
            y1 = by * block_size
            x1 = bx * block_size
            blk = gray_diff[y1 : y1 + block_size, x1 : x1 + block_size]
            block_stds.append(float(np.std(blk)))
            blocks_coords.append([x1, y1, block_size, block_size])

    block_stds_arr = np.array(block_stds)
    mean_val = float(np.mean(block_stds_arr))
    std_val = float(np.std(block_stds_arr))

    anomalous_boxes = []
    if std_val > 1e-4:
        z_scores = (block_stds_arr - mean_val) / std_val
        for idx, z in enumerate(z_scores):
            if z > 2.6:
                anomalous_boxes.append(blocks_coords[idx])

    ela_score = min(100.0, len(anomalous_boxes) * 12.0)
    return ela_score, len(anomalous_boxes), anomalous_boxes


def extract_wavelet_features(img_bgr: np.ndarray) -> tuple[float, float, list[list[int]]]:
    """Computes 2D Daubechies-4 DWT diagonal high-frequency noise residual."""
    h, w = img_bgr.shape[:2]
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)

    # 2D DWT with Daubechies db4
    coeffs2 = pywt.dwt2(gray, "db4")
    _, (_, _, HH) = coeffs2  # Diagonal high-frequency detail

    hh_h, hh_w = HH.shape
    blk = 16
    ny = hh_h // blk
    nx = hh_w // blk

    if ny == 0 or nx == 0:
        return 0.0, 1.0, []

    variances = []
    boxes = []
    for by in range(ny):
        for bx in range(nx):
            sub = HH[by * blk : (by + 1) * blk, bx * blk : (bx + 1) * blk]
            v = float(np.var(sub))
            variances.append(v)
            # Map coordinates back to original image space
            boxes.append([bx * blk * 2, by * blk * 2, blk * 2, blk * 2])

    v_arr = np.array(variances)
    median_v = float(np.median(v_arr))
    min_v = float(np.min(v_arr))

    anom_boxes = []
    if median_v > 0.05:
        # Zero-noise void detection
        for idx, v in enumerate(variances):
            if v < 0.15 * median_v:
                anom_boxes.append(boxes[idx])

    wavelet_score = min(100.0, len(anom_boxes) * 18.0)
    return wavelet_score, min_v, anom_boxes


def extract_copy_move_features(img_bgr: np.ndarray) -> tuple[float, int, list[list[int]]]:
    """ORB keypoint translation vector clustering."""
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    orb = cv2.ORB_create(nfeatures=800)
    kp, des = orb.detectAndCompute(gray, None)

    if des is None or len(kp) < 10:
        return 0.0, 0, []

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=False)
    try:
        matches = bf.knnMatch(des, des, k=2)
    except Exception:
        return 0.0, 0, []

    good_vectors = []
    pts_pairs = []
    for m, n in matches:
        if m.trainIdx != m.queryIdx and m.distance < 0.72 * n.distance:
            p1 = kp[m.queryIdx].pt
            p2 = kp[m.trainIdx].pt
            dx = p2[0] - p1[0]
            dy = p2[1] - p1[1]
            dist = np.hypot(dx, dy)
            if dist > 35.0:  # Ignore adjacent noise
                good_vectors.append((dx, dy))
                pts_pairs.append((p1, p2))

    if len(good_vectors) < 4:
        return 0.0, 0, []

    # Cluster vectors by angle & magnitude
    angles = np.array([np.arctan2(v[1], v[0]) for v in good_vectors])
    mags = np.array([np.hypot(v[0], v[1]) for v in good_vectors])

    clusters = {}
    for i in range(len(good_vectors)):
        key = (round(float(angles[i]), 1), round(float(mags[i]) / 25.0))
        clusters.setdefault(key, []).append(pts_pairs[i])

    max_cluster_size = max(len(c) for c in clusters.values()) if clusters else 0
    detected = max_cluster_size >= 4

    clone_boxes = []
    if detected:
        for pts_pair in max(clusters.values(), key=len):
            p1, p2 = pts_pair
            clone_boxes.append([int(p1[0]) - 15, int(p1[1]) - 15, 30, 30])
            clone_boxes.append([int(p2[0]) - 15, int(p2[1]) - 15, 30, 30])

    score = 75.0 if detected else 0.0
    return score, max_cluster_size, clone_boxes


def extract_ocr_tokens_opencv(img_bgr: np.ndarray) -> list[dict[str, Any]]:
    """OpenCV Morphological connected-components word token extractor."""
    h, w = img_bgr.shape[:2]
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    kernel_grad = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    gradient = cv2.morphologyEx(gray, cv2.MORPH_GRADIENT, kernel_grad)
    _, thresh = cv2.threshold(gradient, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    kernel_connect = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 2))
    connected = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel_connect)

    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(connected, connectivity=8)
    tokens = []
    for i in range(1, num_labels):
        bx = int(stats[i, cv2.CC_STAT_LEFT])
        by = int(stats[i, cv2.CC_STAT_TOP])
        bw = int(stats[i, cv2.CC_STAT_WIDTH])
        bh = int(stats[i, cv2.CC_STAT_HEIGHT])
        area = stats[i, cv2.CC_STAT_AREA]
        if 8 <= bh <= 120 and 8 <= bw <= 650:
            aspect = float(bw) / float(bh)
            if 0.15 <= aspect <= 25.0 and area >= 40:
                tokens.append({
                    "box": [bx, by, bw, bh],
                    "x": bx,
                    "y": by,
                    "w": bw,
                    "h": bh,
                    "baseline_y": float(by + bh),
                    "center_x": float(bx + bw / 2.0),
                    "center_y": float(by + bh / 2.0)
                })
    tokens.sort(key=lambda t: (t["y"], t["x"]))
    return tokens


def extract_baseline_laser_features(tokens: list[dict[str, Any]]) -> tuple[float, float, list[list[int]]]:
    """Calculates sub-pixel linear regression residuals per horizontal row."""
    if len(tokens) < 3:
        return 0.0, 0.0, []

    # Group tokens into horizontal rows (within 12px vertical proximity)
    rows: list[list[dict[str, Any]]] = []
    for t in tokens:
        placed = False
        for r in rows:
            if abs(t["center_y"] - r[0]["center_y"]) < 12.0:
                r.append(t)
                placed = True
                break
        if not placed:
            rows.append([t])

    max_drift = 0.0
    tampered_boxes = []
    for r in rows:
        if len(r) >= 3:
            xs = np.array([t["center_x"] for t in r])
            ys = np.array([t["baseline_y"] for t in r])
            A = np.vstack([xs, np.ones(len(xs))]).T
            m, c = np.linalg.lstsq(A, ys, rcond=None)[0]
            if abs(m) < 0.08:  # Accept horizontal lines
                fitted = m * xs + c
                residuals = np.abs(ys - fitted)
                r_max = float(np.max(residuals))
                if r_max > max_drift:
                    max_drift = r_max
                for idx, res in enumerate(residuals):
                    if res >= 2.5:  # Critical baseline deviation
                        tampered_boxes.append(r[idx]["box"])

    score = min(100.0, max_drift * 25.0) if max_drift >= 2.5 else min(20.0, max_drift * 5.0)
    return score, max_drift, tampered_boxes


def extract_cielab_patch_features(img_bgr: np.ndarray, tokens: list[dict[str, Any]]) -> tuple[float, bool, list[list[int]]]:
    """Computes CIELAB Delta-E color distance between token inner background and card border."""
    if not tokens:
        return 0.0, False, []

    h, w = img_bgr.shape[:2]
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB).astype(np.float32)

    max_delta_e = 0.0
    patch_boxes = []

    for t in tokens[:25]:  # Audit key tokens
        bx, by, bw, bh = t["box"]
        if bx < 10 or by < 10 or bx + bw >= w - 10 or by + bh >= h - 10:
            continue
        inner = lab[by : by + bh, bx : bx + bw]
        # Outer ring sampling (6px perimeter)
        outer_top = lab[max(0, by - 6) : by, bx : bx + bw]
        outer_bot = lab[by + bh : min(h, by + bh + 6), bx : bx + bw]

        inner_mean = np.mean(inner, axis=(0, 1))
        outer_samples = []
        if outer_top.size > 0:
            outer_samples.append(np.mean(outer_top, axis=(0, 1)))
        if outer_bot.size > 0:
            outer_samples.append(np.mean(outer_bot, axis=(0, 1)))

        if outer_samples:
            outer_mean = np.mean(outer_samples, axis=0)
            delta_e = float(np.linalg.norm(inner_mean - outer_mean))
            if delta_e > max_delta_e:
                max_delta_e = delta_e
            if delta_e > 4.5:
                patch_boxes.append([bx, by, bw, bh])

    is_anomaly = max_delta_e > 4.5
    return max_delta_e, is_anomaly, patch_boxes


def extract_all_forensic_features(img_bgr: np.ndarray, metadata: dict[str, Any] | None = None) -> dict[str, Any]:
    """
    Master feature extraction pipeline producing a standardized feature vector
    and structured evidence records.
    """
    metadata = metadata or {}
    h, w = img_bgr.shape[:2]

    # Layer 1 Signal Features
    ela_score, ela_z_blocks, ela_boxes = extract_ela_features(img_bgr)
    wavelet_score, wavelet_min_var, wavelet_boxes = extract_wavelet_features(img_bgr)
    clone_score, clone_vectors, clone_boxes = extract_copy_move_features(img_bgr)

    # Layer 2 Typographic Features
    tokens = extract_ocr_tokens_opencv(img_bgr)
    laser_score, max_drift_px, laser_boxes = extract_baseline_laser_features(tokens)
    delta_e, patch_anomaly, patch_boxes = extract_cielab_patch_features(img_bgr, tokens)

    # Cross-Layer Spatial IoU Synergy
    l1_boxes = ela_boxes + wavelet_boxes + clone_boxes
    l2_boxes = laser_boxes + patch_boxes

    max_iou = 0.0
    for b1 in l1_boxes[:10]:
        for b2 in l2_boxes[:10]:
            x1 = max(b1[0], b2[0])
            y1 = max(b1[1], b2[1])
            x2 = min(b1[0] + b1[2], b2[0] + b2[2])
            y2 = min(b1[1] + b1[3], b2[1] + b2[3])
            iw = max(0, x2 - x1)
            ih = max(0, y2 - y1)
            inter = iw * ih
            if inter > 0:
                union = (b1[2] * b1[3]) + (b2[2] * b2[3]) - inter
                iou = inter / union if union > 0 else 0.0
                if iou > max_iou:
                    max_iou = iou

    # Layer 3 Protocol & Metadata
    temporal_paradox = float(metadata.get("clock_paradox", False))
    upi_invalid = float(metadata.get("upi_invalid", False))
    whatsapp_transcoded = float(metadata.get("is_whatsapp", False))

    feature_records = [
        ForensicFeatureRecord("ela_score", ela_score, "Error Level Analysis Q=90", ela_boxes[0] if ela_boxes else None, 0.85, True, None, "L1_ELA"),
        ForensicFeatureRecord("ela_z_macroblocks", float(ela_z_blocks), "16x16 ELA Z-Score Outliers", None, 0.88, True, None, "L1_ELA_Z"),
        ForensicFeatureRecord("wavelet_void_score", wavelet_score, "Daubechies-4 DWT HH Residual", wavelet_boxes[0] if wavelet_boxes else None, 0.90, True, None, "L1_DWT"),
        ForensicFeatureRecord("wavelet_min_variance", wavelet_min_var, "Minimum Local Wavelet Variance", None, 0.82, True, None, "L1_DWT_VAR"),
        ForensicFeatureRecord("copy_move_vectors", float(clone_vectors), "ORB Vector Clustering", clone_boxes[0] if clone_boxes else None, 0.94, True, None, "L1_ORB"),
        ForensicFeatureRecord("baseline_drift_px", max_drift_px, "Sub-Pixel OLS Baseline Drift", laser_boxes[0] if laser_boxes else None, 0.96, True, None, "L2_LASER"),
        ForensicFeatureRecord("cielab_delta_e", delta_e, "CIELAB Background Delta-E", patch_boxes[0] if patch_boxes else None, 0.92, True, None, "L2_CIELAB"),
        ForensicFeatureRecord("cross_layer_iou", max_iou, "Spatial L1/L2 IoU Intersection", None, 0.98, True, None, "L4_SYNERGY"),
        ForensicFeatureRecord("temporal_clock_paradox", temporal_paradox, "Status Bar Clock vs Timestamp", None, 0.99, True, None, "L3_TEMPORAL"),
        ForensicFeatureRecord("upi_utr_invalid", upi_invalid, "NPCI 12-Digit Reference Syntax", None, 0.99, True, None, "L3_UPI"),
        ForensicFeatureRecord("whatsapp_transcoded", whatsapp_transcoded, "Channel Compression Fingerprint", None, 0.90, True, None, "L3_CONTAINER"),
    ]

    feature_vector = np.array([
        ela_score,
        float(ela_z_blocks),
        wavelet_score,
        wavelet_min_var,
        float(clone_vectors),
        max_drift_px,
        delta_e,
        max_iou,
        temporal_paradox,
        upi_invalid,
        whatsapp_transcoded,
    ], dtype=np.float32)

    feature_names = [
        "ela_score",
        "ela_z_macroblocks",
        "wavelet_void_score",
        "wavelet_min_variance",
        "copy_move_vectors",
        "baseline_drift_px",
        "cielab_delta_e",
        "cross_layer_iou",
        "temporal_clock_paradox",
        "upi_utr_invalid",
        "whatsapp_transcoded",
    ]

    return {
        "feature_vector": feature_vector,
        "feature_names": feature_names,
        "records": [r.to_dict() for r in feature_records],
        "token_count": len(tokens),
        "dimensions": [w, h],
        "boxes": {
            "ela": ela_boxes,
            "wavelet": wavelet_boxes,
            "copy_move": clone_boxes,
            "laser": laser_boxes,
            "patch": patch_boxes,
        }
    }
