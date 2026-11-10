"""
VeriSight Learned Feature Fusion Architecture.
Trains and evaluates regularized logistic regression and gradient-boosted trees
with out-of-fold cross-validation and probability calibration.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import joblib
import numpy as np
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    brier_score_loss,
    f1_score,
    precision_recall_curve,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import StandardScaler


class LearnedFusionModel:
    def __init__(self, model_type: str = "logistic"):
        self.model_type = model_type
        self.scaler = StandardScaler()
        if model_type == "logistic":
            self.base_model = LogisticRegression(C=1.0, solver="lbfgs", max_iter=1000)
        elif model_type == "gradient_boosting":
            self.base_model = HistGradientBoostingClassifier(max_iter=100, min_samples_leaf=3, random_state=42)
        elif model_type == "random_forest":
            self.base_model = RandomForestClassifier(n_estimators=100, max_depth=4, random_state=42)
        else:
            raise ValueError(f"Unknown model_type: {model_type}")

        self.calibrated_model: CalibratedClassifierCV | None = None
        self.is_fitted = False

    def fit_with_cv(self, X: np.ndarray, y: np.ndarray, n_splits: int = 5) -> dict[str, Any]:
        """
        Executes Stratified K-Fold cross-validation to produce out-of-fold predictions,
        preventing in-sample overfitting.
        """
        skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)
        oof_preds = np.zeros(len(y), dtype=np.float32)
        oof_probs = np.zeros(len(y), dtype=np.float32)

        for train_idx, val_idx in skf.split(X, y):
            X_tr, y_tr = X[train_idx], y[train_idx]
            X_va, y_va = X[val_idx], y[val_idx]

            scaler = StandardScaler()
            X_tr_sc = scaler.fit_transform(X_tr)
            X_va_sc = scaler.transform(X_va)

            if self.model_type == "logistic":
                fold_model = LogisticRegression(C=1.0, solver="lbfgs", max_iter=1000)
            elif self.model_type == "gradient_boosting":
                fold_model = HistGradientBoostingClassifier(max_iter=100, min_samples_leaf=2, random_state=42)
            else:
                fold_model = RandomForestClassifier(n_estimators=50, max_depth=3, random_state=42)

            fold_model.fit(X_tr_sc, y_tr)
            probs = fold_model.predict_proba(X_va_sc)[:, 1]
            oof_probs[val_idx] = probs
            oof_preds[val_idx] = (probs >= 0.5).astype(np.float32)

        # Compute Out-of-Fold Evaluation Metrics
        roc_auc = float(roc_auc_score(y, oof_probs))
        brier = float(brier_score_loss(y, oof_probs))
        prec = float(precision_score(y, oof_preds, zero_division=0))
        rec = float(recall_score(y, oof_preds, zero_division=0))
        f1 = float(f1_score(y, oof_preds, zero_division=0))

        # Precision-Recall Curve & FPR at 95% Recall
        p_curve, r_curve, thres = precision_recall_curve(y, oof_probs)
        # Find FPR at 95% recall
        idx_95 = np.where(r_curve >= 0.95)[0]
        th_95 = thres[idx_95[-1]] if len(idx_95) > 0 and idx_95[-1] < len(thres) else 0.5
        preds_at_95 = (oof_probs >= th_95).astype(int)
        neg_mask = (y == 0)
        fpr_at_95 = float(np.sum(preds_at_95[neg_mask]) / np.sum(neg_mask)) if np.sum(neg_mask) > 0 else 0.0

        # Now fit calibrated model on complete dataset
        X_scaled = self.scaler.fit_transform(X)
        self.calibrated_model = CalibratedClassifierCV(estimator=self.base_model, cv=3, method="sigmoid")
        self.calibrated_model.fit(X_scaled, y)
        self.is_fitted = True

        cv_results = {
            "model_type": self.model_type,
            "roc_auc": round(roc_auc, 4),
            "brier_score": round(brier, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "fpr_at_95_recall": round(fpr_at_95, 4),
            "n_samples": len(y),
            "positive_samples": int(np.sum(y)),
            "negative_samples": int(len(y) - np.sum(y)),
            "is_calibrated": True
        }
        return cv_results

    def predict_proba(self, feature_vector: np.ndarray) -> float:
        """Returns calibrated probability P(Tampered | x)."""
        if not self.is_fitted or self.calibrated_model is None:
            raise RuntimeError("Model is not fitted.")
        vec = feature_vector.reshape(1, -1)
        vec_scaled = self.scaler.transform(vec)
        prob = self.calibrated_model.predict_proba(vec_scaled)[0, 1]
        return float(prob)

    def save(self, filepath: str | Path):
        joblib.dump({
            "model_type": self.model_type,
            "scaler": self.scaler,
            "calibrated_model": self.calibrated_model,
            "is_fitted": self.is_fitted
        }, filepath)

    @classmethod
    def load(cls, filepath: str | Path) -> LearnedFusionModel:
        data = joblib.load(filepath)
        inst = cls(model_type=data["model_type"])
        inst.scaler = data["scaler"]
        inst.calibrated_model = data["calibrated_model"]
        inst.is_fitted = data["is_fitted"]
        return inst
