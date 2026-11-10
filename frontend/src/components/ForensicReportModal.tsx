import React from "react";
import {
  X,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Fingerprint,
  Calendar,
  Layers,
  FileCheck,
} from "lucide-react";
import { ForensicAnalysisReport } from "../types/forensic";

interface ForensicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ForensicAnalysisReport | null;
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen || !report) return null;

  const {
    file_sha256,
    filename,
    timestamp,
    image_width,
    image_height,
    overall_tamper_score,
    confidence_score,
    verdict,
    channel_detected,
    layer1,
    layer2,
    layer3,
    layer4,
    synergy,
    findings,
  } = report;

  const handlePrint = () => {
    window.print();
  };

  const caseId = `VS-CASE-${file_sha256.slice(0, 8).toUpperCase()}`;

  return (
    <div
      id="forensic-report-modal-root"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200 forensic-modal-backdrop"
    >
      <div className="watermelon-glass border border-white/[0.1] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden forensic-modal-card print:m-0 print:p-0 print:border-none print:shadow-none print:max-h-full print:w-full print:bg-white print:text-black">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="h-16 px-6 border-b border-white/[0.08] bg-slate-950/80 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/40 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block">
                ISO/IEC 27037 Forensic Audit Dossier
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Official Evidentiary Certificate // VeriSight Core
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-watermelon-coral to-watermelon-crimson hover:from-watermelon-rose hover:to-watermelon-coral text-xs font-semibold text-white transition-all flex items-center space-x-2 shadow-lg shadow-watermelon-coral/25"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="flex-1 overflow-y-auto p-8 font-sans space-y-6 print:p-0 print:text-black print:overflow-visible print:space-y-4">
          {/* Document Header */}
          <div className="border-b-2 border-white/[0.1] print:border-black pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-wider text-white print:text-black">
                  VERISIGHT FORENSIC AUDIT DOSSIER
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800 print:border-black print:bg-gray-100 print:text-black">
                  OFFICIAL AUDIT REPORT
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
                Multi-Layer Digital Screenshot Verification & Splicing Investigation Platform
              </p>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-400 print:text-gray-700 space-y-0.5">
              <div>
                <strong className="text-white print:text-black">
                  Case Reference:
                </strong>{" "}
                {caseId}
              </div>
              <div>
                <strong className="text-white print:text-black">
                  Timestamp:
                </strong>{" "}
                {timestamp}
              </div>
              <div>
                <strong className="text-white print:text-black">
                  Standard:
                </strong>{" "}
                ISO/IEC 27037 Digital Evidence
              </div>
            </div>
          </div>

          {/* Section 1: Executive Verdict & SHA-256 Integrity */}
          <div className="grid grid-cols-2 gap-4 print-avoid-break">
            <div className="p-4 rounded-2xl border border-white/[0.08] print:border-black print:bg-white space-y-2 bg-slate-950/60">
              <span className="text-[10px] font-mono text-slate-500 print:text-gray-600 uppercase tracking-wider block">
                Investigative Determination
              </span>
              <div className="text-xl font-bold font-mono tracking-wide">
                <span
                  className={
                    verdict === "AUTHENTIC_VERIFIED"
                      ? "text-watermelon-mint print:text-emerald-800"
                      : verdict === "SUSPICIOUS_ANOMALIES"
                        ? "text-amber-400 print:text-amber-800"
                        : "text-watermelon-rose print:text-rose-800"
                  }
                >
                  {verdict.replace(/_/g, " ")}
                </span>
              </div>
              <div className="text-xs text-slate-400 print:text-black">
                Overall Tamper Score:{" "}
                <strong className="text-white print:text-black">
                  {overall_tamper_score.toFixed(1)}%
                </strong>{" "}
                | Calibrated Confidence:{" "}
                <strong className="text-white print:text-black">
                  {confidence_score != null ? `${confidence_score.toFixed(1)}%` : "Calibrated"}
                </strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/[0.08] print:border-black print:bg-white space-y-1.5 font-mono text-xs bg-slate-950/60">
              <span className="text-[10px] text-slate-500 print:text-gray-600 uppercase tracking-wider block">
                Evidence Custody Hashes
              </span>
              <div
                className="truncate print:whitespace-normal print:break-all text-slate-300 print:text-black text-[11px]"
                title={file_sha256}
              >
                <strong>SHA-256:</strong> {file_sha256}
              </div>
              <div className="text-slate-400 print:text-black text-[11px]">
                <strong>Dimensions:</strong> {image_width} × {image_height} |{" "}
                <strong>Viewport:</strong> {layer3.viewport_aspect_ratio}
              </div>
              <div className="text-slate-400 print:text-black text-[11px]">
                <strong>Channel Claim:</strong> {channel_detected}
              </div>
            </div>
          </div>

          {/* Section 2: 4-Layer Mathematical Forensic Breakdown */}
          <div className="space-y-3 print-avoid-break">
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 print:text-black border-b border-white/[0.08] print:border-black pb-1">
              4-Layer Forensic Engine Evaluation
            </h4>
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-white/[0.08] print:border-black bg-slate-950/40 print:bg-white space-y-1">
                <span className="text-[10px] font-mono text-slate-500 print:text-gray-700 block">
                  LAYER 1: SIGNAL & NOISE
                </span>
                <div className="text-base font-bold font-mono text-sky-400 print:text-black">
                  {layer1.layer_score.toFixed(1)}%
                </div>
                <div className="text-[10px] font-mono text-slate-400 print:text-gray-800 space-y-0.5">
                  <div>ELA: {layer1.ela_score.toFixed(1)}%</div>
                  <div>Wavelet: {layer1.wavelet_noise_score.toFixed(1)}%</div>
                  <div>Clones: {layer1.clone_count}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-white/[0.08] print:border-black bg-slate-950/40 print:bg-white space-y-1">
                <span className="text-[10px] font-mono text-slate-500 print:text-gray-700 block">
                  LAYER 2: TYPOGRAPHY & OCR
                </span>
                <div className="text-base font-bold font-mono text-watermelon-coral print:text-black">
                  {layer2.layer_score.toFixed(1)}%
                </div>
                <div className="text-[10px] font-mono text-slate-400 print:text-gray-800 space-y-0.5">
                  <div>Drift: +{layer2.max_baseline_drift_px.toFixed(1)}px</div>
                  <div>CIELAB ΔE: {layer2.max_delta_e.toFixed(1)}</div>
                  <div>Lasers: {layer2.lasers.length} tracks</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-white/[0.08] print:border-black bg-slate-950/40 print:bg-white space-y-1">
                <span className="text-[10px] font-mono text-slate-500 print:text-gray-700 block">
                  LAYER 3: METADATA & PROTOCOL
                </span>
                <div className="text-base font-bold font-mono text-watermelon-purple print:text-black">
                  {layer3.layer_score.toFixed(1)}%
                </div>
                <div className="text-[10px] font-mono text-slate-400 print:text-gray-800 space-y-0.5">
                  <div>UTR Check: {layer3.upi_utr_valid ? "VALID" : "INVALID"}</div>
                  <div>
                    Clock: {layer3.clock_paradox_detected ? "PARADOX" : "OK"}
                  </div>
                  <div>Laundered: {layer3.is_whatsapp_laundered ? "YES" : "NO"}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-white/[0.08] print:border-black bg-slate-950/40 print:bg-white space-y-1">
                <span className="text-[10px] font-mono text-slate-500 print:text-gray-700 block">
                  LAYER 4: ENSEMBLE FUSION
                </span>
                <div className="text-base font-bold font-mono text-amber-400 print:text-black">
                  {layer4.layer_score.toFixed(1)}%
                </div>
                <div className="text-[10px] font-mono text-slate-400 print:text-gray-800 space-y-0.5">
                  <div>
                    Synergy:{" "}
                    {synergy.synergy_multiplier_applied
                      ? `x${synergy.multiplier_factor}`
                      : "NONE"}
                  </div>
                  <div>
                    VLM: {layer4.vlm_used ? layer4.vlm_provider : "OFFLINE"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Cross-Layer Spatial IoU Synergy */}
          {synergy.synergy_multiplier_applied && (
            <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/20 print:border-amber-800 print:bg-amber-50 text-xs print-avoid-break">
              <strong className="text-amber-400 print:text-amber-900 font-mono block mb-1">
                Cross-Layer Spatial IoU Synergy Alert (x
                {synergy.multiplier_factor} Multiplier Applied):
              </strong>
              <p className="text-amber-200/90 print:text-black leading-relaxed">
                {synergy.synergy_explanation}
              </p>
            </div>
          )}

          {/* Section 4: Primary Evidence Exhibits */}
          <div className="space-y-3 print-avoid-break">
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 print:text-black border-b border-white/[0.08] print:border-black pb-1">
              Primary Visual Forensic Exhibits
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-white/[0.08] print:border-black rounded-xl p-2 bg-slate-950/40 print:bg-white text-center">
                <span className="text-[10px] font-mono text-slate-400 print:text-black font-semibold block mb-1.5">
                  Exhibit A: Original Capture
                </span>
                <img
                  src={report.original_image_b64}
                  alt="Exhibit A"
                  className="max-h-48 mx-auto object-contain rounded-lg print:max-h-40"
                />
              </div>

              <div className="border border-white/[0.08] print:border-black rounded-xl p-2 bg-slate-950/40 print:bg-white text-center">
                <span className="text-[10px] font-mono text-slate-400 print:text-black font-semibold block mb-1.5">
                  Exhibit B: ELA Heatmap
                </span>
                <img
                  src={layer1.ela_b64}
                  alt="Exhibit B"
                  className="max-h-48 mx-auto object-contain rounded-lg print:max-h-40"
                />
              </div>

              <div className="border border-white/[0.08] print:border-black rounded-xl p-2 bg-slate-950/40 print:bg-white text-center">
                <span className="text-[10px] font-mono text-slate-400 print:text-black font-semibold block mb-1.5">
                  Exhibit C: Wavelet db4 Noise
                </span>
                <img
                  src={layer1.wavelet_noise_b64}
                  alt="Exhibit C"
                  className="max-h-48 mx-auto object-contain rounded-lg print:max-h-40"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Specific Findings Table */}
          <div className="space-y-2 print-avoid-break">
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 print:text-black border-b border-white/[0.08] print:border-black pb-1">
              Evidentiary Findings Log ({findings.length} Items)
            </h4>
            <table className="w-full text-left text-xs font-mono border border-white/[0.08] print:border-black rounded-xl overflow-hidden">
              <thead className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-black font-bold">
                <tr>
                  <th className="p-2 border-b border-white/[0.08] print:border-black">
                    Severity
                  </th>
                  <th className="p-2 border-b border-white/[0.08] print:border-black">
                    Layer
                  </th>
                  <th className="p-2 border-b border-white/[0.08] print:border-black">
                    Observation
                  </th>
                  <th className="p-2 border-b border-white/[0.08] print:border-black">
                    Metric Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] print:divide-gray-300">
                {findings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-3 text-center text-slate-500 print:text-gray-700"
                    >
                      No suspicious anomalies or tampering signatures detected.
                    </td>
                  </tr>
                ) : (
                  findings.map((f) => (
                    <tr key={f.id} className="text-[11px] print:text-black">
                      <td className="p-2 font-bold">
                        <span
                          className={
                            f.severity === "CRITICAL"
                              ? "text-watermelon-rose print:text-rose-800"
                              : f.severity === "HIGH"
                                ? "text-orange-400 print:text-orange-800"
                                : "text-amber-400 print:text-amber-800"
                          }
                        >
                          {f.severity}
                        </span>
                      </td>
                      <td className="p-2 text-slate-400 print:text-black">
                        L{f.layer}
                      </td>
                      <td className="p-2 text-slate-200 print:text-black">
                        <strong>{f.title}:</strong> {f.description}
                      </td>
                      <td className="p-2 text-sky-400 print:text-black font-semibold">
                        {f.metric_name}: {f.metric_value}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Section 6: Legal & Forensic Certification */}
          <div className="pt-4 border-t-2 border-white/[0.1] print:border-black text-[10px] text-slate-500 print:text-gray-800 space-y-2 print-avoid-break">
            <p>
              <strong>Forensic Methodological Disclosure:</strong> This document was generated automatically by the VeriSight Multi-Layer Forensic Verification Pipeline utilizing deterministic signal processing (Multi-scale ELA, Daubechies db4 Wavelet Residuals, ORB keypoint tracking), geometric baseline linear regression, and container metadata verification.
            </p>
            <p>
              <strong>Evidentiary Limitations:</strong> This report identifies visual, signal, and geometric alterations. In accordance with ISO/IEC 27037:2012, digital image analysis does not confirm bank ledger movement or financial settlement.
            </p>
            <div className="pt-2 flex justify-between items-end text-[10px] font-mono border-t border-white/[0.08] print:border-gray-400 print:text-black mt-2">
              <div>
                <span>Examiner Seal: </span>
                <strong className="text-white print:text-black">VERISIGHT-CORE-DETERMINISTIC</strong>
              </div>
              <div>
                <span>Digital Hash: </span>
                <span className="text-[#a3a380] print:text-black">{file_sha256.slice(0, 16)}...</span>
              </div>
              <div>
                <span>Sign-off: </span>
                <span className="border-b border-black print:inline-block w-32 pb-0.5 text-center">ELECTRONICALLY VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
