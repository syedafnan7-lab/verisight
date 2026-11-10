"""
VeriSight Production Model Registry & Management Engine.
Enforces model versioning, calibration status, and rollback paths.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import joblib

REGISTRY_PATH = Path(__file__).resolve().parent / "models.json"
BASE_DIR = Path(__file__).resolve().parent.parent


class ModelRegistry:
    def __init__(self, registry_file: Path = REGISTRY_PATH):
        self.registry_file = registry_file
        self._data = self._load_registry()

    def _load_registry(self) -> dict[str, Any]:
        if not self.registry_file.exists():
            return {"active_production_model_id": None, "models": []}
        with open(self.registry_file, "r") as f:
            return json.load(f)

    def get_active_model_meta(self) -> dict[str, Any] | None:
        active_id = self._data.get("active_production_model_id")
        for m in self._data.get("models", []):
            if m["model_id"] == active_id:
                return m
        return None

    def list_models(self) -> list[dict[str, Any]]:
        return self._data.get("models", [])

    def load_active_model(self) -> Any | None:
        meta = self.get_active_model_meta()
        if not meta or not meta.get("source_checkpoint"):
            return None
        chk_rel = meta["source_checkpoint"]
        # Look relative to ROOT_DIR or BASE_DIR
        chk_path = BASE_DIR.parent / chk_rel
        if not chk_path.exists():
            chk_path = BASE_DIR / chk_rel
        if chk_path.exists():
            return joblib.load(str(chk_path))
        return None


model_registry = ModelRegistry()
