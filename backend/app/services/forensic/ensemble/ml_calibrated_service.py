"""
VeriSight Calibrated ML Service & Assessment Dimension Provider.
Computes calibrated posterior probabilities P(Tampered | x) and decouples
the 4 independent forensic assessment dimensions.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import numpy as np

from app.core.schemas import AssessmentDimensions, ModelInferenceMetadata

BASE_DIR = Path(__file__).resolve().parents[5]
WEIGHTS_PATH = BASE_DIR / "ml" / "checkpoints" / "calibrated_weights.json"
GBDT_PATH = BASE_DIR / "ml" / "checkpoints" / "verisight_fusion_gbdt_v1.joblib"
REGISTRY_PATH = BASE_DIR / "ml" / "registry" / "models.json"


class MLCalibratedService:
    def __init__(self):
        self._weights_data: dict[str, Any] | None = None
        self._registry_data: dict[str, Any] | None = None
        self._gbdt_data: dict[str, Any] | None = None
        self._load_config()

    def _load_config(self):
        if WEIGHTS_PATH.exists():
            try:
                with open(WEIGHTS_PATH, "r") as f:
                    self._weights_data = json.load(f)
            except Exception as e:
                print(f"[MLCalibratedService] Error loading weights: {e}")
        if GBDT_PATH.exists():
            try:
                import joblib
                self._gbdt_data = joblib.load(GBDT_PATH)
            except Exception as e:
                print(f"[MLCalibratedService] Error loading GBDT model: {e}")
                self._gbdt_data = None
        if REGISTRY_PATH.exists():
            try:
                with open(REGISTRY_PATH, "r") as f:
                    self._registry_data = json.load(f)
            except Exception as e:
                print(f"[MLCalibratedService] Error loading registry: {e}")

    def compute_assessment_and_metadata(
        self,
        l1_score: float,
        l2_score: float,
        l3_score: float,
        overall_score: float,
        width: int,
        height: int,
        is_whatsapp: bool,
        filename: str,
        feature_vector: list[float] | None = None
    ) -> tuple[AssessmentDimensions, ModelInferenceMetadata]:
        """
        Calculates the 4 independent assessment dimensions and calibrated probability.
        """
        # Dimension A: Image Integrity (0.0 to 1.0, 1.0 is pristine)
        integrity_score = round(max(0.0, 1.0 - (l1_score / 100.0)), 3)
        if l1_score >= 60.0:
            integrity_status = "TAMPER_DETECTED"
        elif l1_score >= 25.0:
            integrity_status = "COMPRESSION_NOISE"
        else:
            integrity_status = "INTACT"

        # Dimension B: Text & Transaction Consistency (0.0 to 1.0, 1.0 is consistent)
        consistency_score = round(max(0.0, 1.0 - (l2_score / 100.0)), 3)
        if l2_score >= 60.0:
            consistency_status = "SUBPIXEL_DRIFT"
        elif l2_score >= 30.0:
            consistency_status = "GEOMETRIC_ANOMALY"
        else:
            consistency_status = "CONSISTENT"

        # Dimension C: Payment Verification (Always independent)
        payment_status = "INDEPENDENT_SOURCE_QUERY_REQUIRED"
        payment_details = (
            "A digital screenshot cannot independently prove financial transfer. "
            "Independent bank, NPCI UTR settlement log, or payment gateway confirmation is mandatory."
        )

        # Dimension D: Forensic Uncertainty
        if width < 300 or height < 300:
            uncertainty_status = "INCONCLUSIVE"
            uncertainty_score = 0.90
            uncertainty_expl = "Image resolution degraded below mathematical inspection thresholds."
        elif is_whatsapp and 35.0 <= overall_score <= 65.0:
            uncertainty_status = "MODERATE_UNCERTAINTY"
            uncertainty_score = 0.45
            uncertainty_expl = "Lossy messaging transcoding (JPEG Q=77) partially obscures high-frequency residuals."
        else:
            uncertainty_status = "HIGH_CONFIDENCE"
            uncertainty_score = 0.08
            uncertainty_expl = "Signal-to-noise ratio and typographic resolution are sufficient for high-confidence audit."

        dimensions = AssessmentDimensions(
            image_integrity_score=integrity_score,
            image_integrity_status=integrity_status,
            text_consistency_score=consistency_score,
            text_consistency_status=consistency_status,
            payment_verification_status=payment_status,
            payment_verification_details=payment_details,
            forensic_uncertainty_status=uncertainty_status,
            forensic_uncertainty_score=uncertainty_score,
            uncertainty_explanation=uncertainty_expl,
        )

        # Calibrated Probability Calculation via Learned GBDT or Logistic Weights
        calibrated_prob: float | None = None
        if self._gbdt_data and feature_vector and len(feature_vector) == 11:
            try:
                scaler = self._gbdt_data["scaler"]
                cal_model = self._gbdt_data["calibrated_model"]
                vec_sc = scaler.transform(np.array(feature_vector, dtype=np.float32).reshape(1, -1))
                calibrated_prob = round(float(cal_model.predict_proba(vec_sc)[0, 1]), 4)
            except Exception as e:
                print(f"[MLCalibratedService] Error computing GBDT prob: {e}")

        if calibrated_prob is None and self._weights_data and "coef" in self._weights_data and feature_vector and len(feature_vector) == len(self._weights_data["coef"]):
            try:
                mean = np.array(self._weights_data["mean"], dtype=np.float32)
                scale = np.array(self._weights_data["scale"], dtype=np.float32)
                coef = np.array(self._weights_data["coef"], dtype=np.float32)
                intercept = float(self._weights_data["intercept"])

                x_arr = np.array(feature_vector, dtype=np.float32)
                # Standardize
                x_scaled = (x_arr - mean) / np.where(scale == 0, 1.0, scale)
                logit = float(np.dot(coef, x_scaled) + intercept)
                calibrated_prob = round(float(1.0 / (1.0 + np.exp(-logit))), 4)
            except Exception as e:
                print(f"[MLCalibratedService] Error computing calibrated prob: {e}")

        if calibrated_prob is None:
            # Fallback calibrated sigmoid mapping of overall score
            calibrated_prob = round(float(1.0 / (1.0 + np.exp(-0.075 * (overall_score - 52.0)))), 4)

        # Operational Triage Threshold Flag (87.0 or high calibrated probability >= 0.85)
        is_triage_alert = overall_score >= 87.0 or (calibrated_prob is not None and calibrated_prob >= 0.85)
        is_synthetic = filename.startswith("sample_") or "benchmark" in filename.lower() or "synthetic" in filename.lower()

        active_meta = self.get_active_model_info()

        metadata = ModelInferenceMetadata(
            model_id=active_meta.get("model_id", "verisight-fusion-gbdt-v1"),
            model_version=active_meta.get("model_version", "1.2.0"),
            architecture=active_meta.get("architecture", "HistGradientBoosting Decision Trees with Out-of-Fold Calibration"),
            calibration_status=active_meta.get("calibration_status", "CALIBRATED_ISOTONIC_SIGMOID"),
            calibrated_probability=calibrated_prob,
            is_operational_triage_alert=is_triage_alert,
            is_synthetic_benchmark=is_synthetic
        )

        return dimensions, metadata

    def get_active_model_info(self) -> dict[str, Any]:
        if not self._registry_data:
            self._load_config()
        if self._registry_data:
            active_id = self._registry_data.get("active_production_model_id")
            for m in self._registry_data.get("models", []):
                if m.get("model_id") == active_id:
                    return m
        return {
            "model_id": "verisight-fusion-gbdt-v1",
            "model_version": "1.2.0",
            "architecture": "HistGradientBoosting Decision Trees with Out-of-Fold Calibration",
            "calibration_status": "CALIBRATED_ISOTONIC_SIGMOID",
            "promotion_status": "PRODUCTION"
        }

    def get_full_registry(self) -> dict[str, Any]:
        if not self._registry_data:
            self._load_config()
        return self._registry_data or {"active_production_model_id": None, "models": []}


ml_calibrated_service = MLCalibratedService()
