"""
VeriSight Calibrated ML Service & Assessment Dimension Provider.
Directly executes the trained verisight_fusion_gbdt_v1.joblib artifact,
validates feature vectors against Canonical Feature Schema v1.0.0,
and decouples the 4 independent forensic assessment dimensions.
"""
from __future__ import annotations

import json
import logging
import sys
from pathlib import Path
from typing import Any

import numpy as np

# Ensure project root is in sys.path for schema import
BASE_DIR = Path(__file__).resolve().parents[5]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

try:
    from ml.src.feature_extraction.schema import (
        CANONICAL_FEATURE_NAMES,
        FEATURE_BOUNDS,
        FEATURE_DEFAULTS,
        FEATURE_SCHEMA_VERSION,
        validate_and_format_feature_vector,
    )
except ImportError:
    FEATURE_SCHEMA_VERSION = "1.0.0"
    CANONICAL_FEATURE_NAMES = [
        "ela_score",
        "ela_z_macroblocks",
        "wavelet_void_score",
        "wavelet_min_variance",
        "copy_move_vectors",
        "baseline_drift_px",
        "cielab_patch_delta_e",
        "cross_layer_iou",
        "temporal_clock_paradox",
        "upi_utr_invalid",
        "whatsapp_transcoded",
    ]
    FEATURE_BOUNDS = {}
    FEATURE_DEFAULTS = {}
    validate_and_format_feature_vector = None

from app.core.schemas import AssessmentDimensions, ModelInferenceMetadata

logger = logging.getLogger("verisight.ml_service")

CHECKPOINT_PATH = BASE_DIR / "ml" / "checkpoints" / "verisight_fusion_gbdt_v1.joblib"
REGISTRY_PATH = BASE_DIR / "ml" / "registry" / "models.json"


class MLCalibratedService:
    def __init__(self):
        self._model_artifact: dict[str, Any] | None = None
        self._scaler = None
        self._calibrated_model = None
        self._registry_data: dict[str, Any] | None = None
        self._model_loaded: bool = False
        self._load_registry()
        self._load_model_artifact()

    def _load_registry(self):
        if REGISTRY_PATH.exists():
            try:
                with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
                    self._registry_data = json.load(f)
            except Exception as e:
                logger.error(f"[MLCalibratedService] Error loading registry: {e}")

    def _load_model_artifact(self):
        if not CHECKPOINT_PATH.exists():
            logger.warning(f"[MLCalibratedService] Checkpoint not found at {CHECKPOINT_PATH}")
            self._model_loaded = False
            return

        try:
            import joblib
            data = joblib.load(CHECKPOINT_PATH)
            if not isinstance(data, dict):
                logger.error("[MLCalibratedService] Checkpoint is not a valid dict artifact")
                self._model_loaded = False
                return

            schema_ver = data.get("feature_schema_version")
            if schema_ver != FEATURE_SCHEMA_VERSION:
                logger.warning(
                    f"[MLCalibratedService] Schema version mismatch: "
                    f"artifact={schema_ver}, expected={FEATURE_SCHEMA_VERSION}"
                )

            self._scaler = data.get("scaler")
            self._calibrated_model = data.get("calibrated_model")
            self._model_artifact = data
            self._model_loaded = (self._scaler is not None and self._calibrated_model is not None)
            logger.info(
                f"[MLCalibratedService] Successfully loaded artifact {data.get('model_id', 'unknown')} "
                f"(version={data.get('model_version')}, schema={schema_ver})"
            )
        except Exception as e:
            logger.error(f"[MLCalibratedService] Failed to load joblib checkpoint: {e}", exc_info=True)
            self._model_loaded = False

    def reload_model(self):
        """Forces reload of registry and model artifact."""
        self._load_registry()
        self._load_model_artifact()

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
        feature_vector: list[float] | None = None,
    ) -> tuple[AssessmentDimensions, ModelInferenceMetadata]:
        """
        Calculates the 4 independent assessment dimensions and runs live GBDT inference.
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

        # Dimension C: Payment Verification (Always independent of pixels)
        payment_status = "INDEPENDENT_SOURCE_QUERY_REQUIRED"
        payment_details = (
            "A digital screenshot cannot independently prove financial transfer. "
            "Independent bank, NPCI UTR settlement log, or payment gateway confirmation is mandatory."
        )

        # Dimension D: Forensic Uncertainty
        if width < 300 or height < 300:
            uncertainty_status = "INCONCLUSIVE"
            uncertainty_score = 0.90
            uncertainty_expl = "Image resolution degraded below mathematical inspection thresholds (<300px)."
        elif is_whatsapp and 35.0 <= overall_score <= 65.0:
            uncertainty_status = "MODERATE_UNCERTAINTY"
            uncertainty_score = 0.45
            uncertainty_expl = "Lossy messaging transcoding (JPEG Q=77) partially obscures high-frequency residuals."
        else:
            uncertainty_status = "HIGH_CONFIDENCE"
            uncertainty_score = 0.08
            uncertainty_expl = "Signal-to-noise ratio and typographic resolution are sufficient for mathematical audit."

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

        # Missing evidence compilation
        missing_evidence: list[str] = [
            "Independent banking / NPCI UTR settlement log unavailable from image"
        ]
        if width < 300 or height < 300:
            missing_evidence.append("High-resolution sensor PRNU noise floor (image < 300px)")
        if is_whatsapp:
            missing_evidence.append("Camera quantization table (stripped during lossy messaging compression)")

        # Live ML Inference via GBDT Artifact
        calibrated_prob: float | None = None
        inference_status = "FALLBACK_HEURISTIC"

        if self._model_loaded and feature_vector is not None:
            try:
                # Format & validate through Canonical Schema
                if validate_and_format_feature_vector is not None:
                    vec_clean = validate_and_format_feature_vector(feature_vector)
                else:
                    vec_clean = [float(v) if v is not None and not np.isnan(v) else 0.0 for v in feature_vector]

                if len(vec_clean) == 11:
                    x_arr = np.array([vec_clean], dtype=np.float32)
                    x_scaled = self._scaler.transform(x_arr)
                    raw_prob = float(self._calibrated_model.predict_proba(x_scaled)[0, 1])
                    calibrated_prob = round(raw_prob, 4)
                    inference_status = "EXECUTED"
            except Exception as e:
                logger.error(f"[MLCalibratedService] Execution failed: {e}", exc_info=True)
                inference_status = "FALLBACK_HEURISTIC"

        if calibrated_prob is None:
            # Fallback calibrated sigmoid mapping of overall score
            calibrated_prob = round(float(1.0 / (1.0 + np.exp(-0.075 * (overall_score - 52.0)))), 4)

        # Triage alert flag (calibrated prob >= 0.85)
        is_triage_alert = calibrated_prob >= 0.85
        is_synthetic = (
            filename.startswith("sample_")
            or "benchmark" in filename.lower()
            or "synthetic" in filename.lower()
        )

        active_meta = self.get_active_model_info()

        metadata = ModelInferenceMetadata(
            model_id=active_meta.get("model_id", "verisight-fusion-gbdt-v1"),
            model_version=active_meta.get("model_version", "1.2.1"),
            architecture=active_meta.get("architecture", "HistGradientBoosting Classifier with 3-fold CalibratedClassifierCV"),
            calibration_status=active_meta.get("calibration_status", "CALIBRATED_SIGMOID_CV3"),
            promotion_status=active_meta.get("promotion_status", "EXPERIMENTAL"),
            feature_schema_version=FEATURE_SCHEMA_VERSION,
            inference_status=inference_status,
            calibrated_probability=calibrated_prob,
            missing_evidence=missing_evidence,
            is_operational_triage_alert=is_triage_alert,
            is_synthetic_benchmark=is_synthetic,
            disclaimer="EXPERIMENTAL MODEL: Evaluated on synthetic benchmark. Not validated for independent real-world legal certainty."
        )

        return dimensions, metadata

    def get_active_model_info(self) -> dict[str, Any]:
        if not self._registry_data:
            self._load_registry()
        if self._registry_data:
            active_id = self._registry_data.get("active_production_model_id")
            for m in self._registry_data.get("models", []):
                if m.get("model_id") == active_id:
                    return m
        return {
            "model_id": "verisight-fusion-gbdt-v1",
            "model_version": "1.2.1",
            "architecture": "HistGradientBoosting Classifier with 3-fold CalibratedClassifierCV",
            "calibration_status": "CALIBRATED_SIGMOID_CV3",
            "promotion_status": "EXPERIMENTAL",
            "feature_schema_version": "1.0.0"
        }

    def get_full_registry(self) -> dict[str, Any]:
        if not self._registry_data:
            self._load_registry()
        return self._registry_data or {"active_production_model_id": None, "models": []}


ml_calibrated_service = MLCalibratedService()
