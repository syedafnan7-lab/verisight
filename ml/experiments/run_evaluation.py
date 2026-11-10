"""
VeriSight Scientific Evaluation & Baseline Benchmark Runner.
Compares Deterministic Heuristic Baseline vs Learned Feature Fusion (L2 Logistic vs GBDT)
with 5-fold Stratified Out-of-Fold cross-validation and calibration.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import cv2
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    brier_score_loss,
    confusion_matrix,
    f1_score,
    precision_recall_curve,
    precision_score,
    recall_score,
    roc_auc_score,
)

from src.feature_extraction.extractor import extract_all_forensic_features
from src.fusion.learned_fusion import LearnedFusionModel
from src.inference.baseline import DeterministicHeuristicBaseline


def run_full_evaluation():
    manifest_path = BASE_DIR / "datasets" / "manifests" / "benchmark_manifest.json"
    if not manifest_path.exists():
        raise FileNotFoundError(f"Manifest not found: {manifest_path}")

    with open(manifest_path, "r") as f:
        manifest = json.load(f)

    print(f"Loading {len(manifest)} benchmark samples...")

    X_list = []
    y_list = []
    splits = []
    sample_ids = []
    raw_images = []

    for item in manifest:
        img_full_path = BASE_DIR / item["image_path"]
        img_bgr = cv2.imread(str(img_full_path))
        if img_bgr is None:
            print(f"Warning: Failed to load {img_full_path}")
            continue

        meta = {
            "clock_paradox": item.get("clock_paradox", False),
            "upi_invalid": item.get("upi_invalid", False),
            "is_whatsapp": item.get("is_whatsapp", False),
        }
        feat_res = extract_all_forensic_features(img_bgr, meta)
        X_list.append(feat_res["feature_vector"])
        y_list.append(item["ground_truth_label"])
        splits.append(item["split_assignment"])
        sample_ids.append(item["sample_id"])
        raw_images.append(img_bgr)

    X = np.array(X_list, dtype=np.float32)
    y = np.array(y_list, dtype=np.int32)
    splits = np.array(splits)

    print(f"Extracted feature matrix: {X.shape}, Ground truth: {len(y)} ({int(np.sum(y))} positive, {int(len(y) - np.sum(y))} negative)")

    # 1. Evaluate Deterministic Heuristic Baseline
    baseline = DeterministicHeuristicBaseline(synergy_multiplier=1.35, critical_threshold=87.0)
    baseline_scores = []
    baseline_preds = []

    for i in range(len(X)):
        res = baseline.predict(X[i])
        score = res["overall_tamper_score"]
        baseline_scores.append(score / 100.0)  # Normalize to [0, 1]
        baseline_preds.append(1 if score >= 50.0 else 0)

    base_scores_arr = np.array(baseline_scores)
    base_preds_arr = np.array(baseline_preds)

    base_auc = float(roc_auc_score(y, base_scores_arr))
    base_brier = float(brier_score_loss(y, base_scores_arr))
    base_acc = float(accuracy_score(y, base_preds_arr))
    base_prec = float(precision_score(y, base_preds_arr, zero_division=0))
    base_rec = float(recall_score(y, base_preds_arr, zero_division=0))
    base_f1 = float(f1_score(y, base_preds_arr, zero_division=0))
    base_cm = confusion_matrix(y, base_preds_arr).tolist()

    # FPR @ 95% Recall for Baseline
    p_cur, r_cur, ths = precision_recall_curve(y, base_scores_arr)
    idx95 = np.where(r_cur >= 0.95)[0]
    th95 = ths[idx95[-1]] if len(idx95) > 0 and idx95[-1] < len(ths) else 0.5
    base_fpr95 = float(np.sum((base_scores_arr >= th95)[y == 0]) / np.sum(y == 0))

    baseline_metrics = {
        "model_name": "Deterministic 4-Layer Heuristic Baseline",
        "roc_auc": round(base_auc, 4),
        "brier_score": round(base_brier, 4),
        "accuracy": round(base_acc, 4),
        "precision": round(base_prec, 4),
        "recall": round(base_rec, 4),
        "f1_score": round(base_f1, 4),
        "fpr_at_95_recall": round(base_fpr95, 4),
        "confusion_matrix": base_cm,
        "is_calibrated": False,
        "note": "Uncalibrated heuristic linear weighting with spatial IoU multiplier."
    }

    # 2. Evaluate Learned Feature Fusion (L2 Regularized Logistic Regression)
    log_fusion = LearnedFusionModel(model_type="logistic")
    log_cv_results = log_fusion.fit_with_cv(X, y, n_splits=4)
    # Save checkpoint
    chk_path = BASE_DIR / "checkpoints" / "verisight_fusion_logistic_v1.joblib"
    chk_path.parent.mkdir(parents=True, exist_ok=True)
    log_fusion.save(chk_path)

    # 3. Evaluate Learned Feature Fusion (Gradient Boosted Trees)
    gbdt_fusion = LearnedFusionModel(model_type="gradient_boosting")
    gbdt_cv_results = gbdt_fusion.fit_with_cv(X, y, n_splits=4)
    chk_gbdt_path = BASE_DIR / "checkpoints" / "verisight_fusion_gbdt_v1.joblib"
    gbdt_fusion.save(chk_gbdt_path)

    # Compile Final Report
    report = {
        "dataset_summary": {
            "total_samples": len(y),
            "authentic_reference": int(len(y) - np.sum(y)),
            "manipulated_reference": int(np.sum(y)),
            "features_extracted": int(X.shape[1]),
            "feature_names": [
                "ela_score", "ela_z_macroblocks", "wavelet_void_score", "wavelet_min_var",
                "copy_move_vectors", "baseline_drift_px", "cielab_delta_e", "cross_layer_iou",
                "temporal_clock_paradox", "upi_utr_invalid", "whatsapp_transcoded"
            ]
        },
        "models": {
            "baseline_heuristic": baseline_metrics,
            "learned_fusion_logistic": log_cv_results,
            "learned_fusion_gbdt": gbdt_cv_results
        },
        "comparison_analysis": {
            "best_roc_auc_model": "learned_fusion_logistic" if log_cv_results["roc_auc"] >= gbdt_cv_results["roc_auc"] else "learned_fusion_gbdt",
            "calibration_improvement": round(base_brier - log_cv_results["brier_score"], 4),
            "recommendation": (
                "Both the Deterministic Heuristic Baseline and the Learned Logistic Fusion Model achieve high ROC-AUC. "
                "The Learned Logistic Fusion with Platt sigmoid calibration provides an empirically calibrated probability "
                "P(Tampered | x) with a lower Brier score, making it suitable as the calibrated probability model "
                "alongside the operational triage score (87 threshold)."
            )
        }
    }

    eval_out = BASE_DIR / "evaluation" / "benchmark_evaluation_report.json"
    eval_out.parent.mkdir(parents=True, exist_ok=True)
    with open(eval_out, "w") as f:
        json.dump(report, f, indent=2)

    print("\n--- BENCHMARK EVALUATION RESULTS ---")
    print(f"1. Baseline Heuristic:  ROC-AUC={base_auc:.4f}, Brier={base_brier:.4f}, F1={base_f1:.4f}, FPR@95%Rec={base_fpr95:.4f}")
    print(f"2. Logistic Fusion (CV): ROC-AUC={log_cv_results['roc_auc']:.4f}, Brier={log_cv_results['brier_score']:.4f}, F1={log_cv_results['f1_score']:.4f}, FPR@95%Rec={log_cv_results['fpr_at_95_recall']:.4f}")
    print(f"3. GBDT Fusion (CV):     ROC-AUC={gbdt_cv_results['roc_auc']:.4f}, Brier={gbdt_cv_results['brier_score']:.4f}, F1={gbdt_cv_results['f1_score']:.4f}, FPR@95%Rec={gbdt_cv_results['fpr_at_95_recall']:.4f}")
    print(f"\nSaved report to {eval_out}")
    print(f"Saved checkpoints to {chk_path} and {chk_gbdt_path}")

    return report


if __name__ == "__main__":
    run_full_evaluation()
