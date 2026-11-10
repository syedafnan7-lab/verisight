"""
Unit and integration tests for ML model registry, evaluation, and assessment dimensions.
"""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_model_status():
    resp = client.get("/api/model/status")
    assert resp.status_code == 200
    data = resp.json()
    assert "active_model_id" in data
    assert data["active_model_id"] == "verisight-fusion-gbdt-v1"
    assert data["calibration_status"] == "CALIBRATED_ISOTONIC_SIGMOID"
    assert data["ml_environment_ready"] is True
    assert len(data["available_models"]) >= 1


def test_get_model_evaluation():
    resp = client.get("/api/model/evaluation")
    assert resp.status_code == 200
    data = resp.json()
    assert "models" in data
    assert "learned_fusion_logistic" in data["models"]
    assert "baseline_heuristic" in data["models"]
    # Check that ROC-AUC is reported
    assert data["models"]["baseline_heuristic"]["roc_auc"] > 0.0


def test_get_benchmark_results():
    resp = client.get("/api/benchmark/results")
    assert resp.status_code == 200
    data = resp.json()
    assert "evaluation" in data
    assert "manifest_count" in data
    assert data["manifest_count"] >= 20


def test_analyze_sample_returns_assessment_dimensions():
    resp = client.post("/api/analyze-sample/sample_1")
    assert resp.status_code == 200
    data = resp.json()
    assert "assessment_dimensions" in data
    dims = data["assessment_dimensions"]
    assert "image_integrity_score" in dims
    assert "text_consistency_score" in dims
    assert "payment_verification_status" in dims
    assert dims["payment_verification_status"] == "INDEPENDENT_SOURCE_QUERY_REQUIRED"
    assert "forensic_uncertainty_status" in dims

    assert "model_metadata" in data
    meta = data["model_metadata"]
    assert meta["is_synthetic_benchmark"] is True
    assert "calibrated_probability" in meta
    assert 0.0 <= meta["calibrated_probability"] <= 1.0
