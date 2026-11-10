import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  FileImage,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Scan,
  Hash,
  Maximize2,
  HardDrive,
  Info,
  Layers,
} from "lucide-react";
import { DemoSampleMeta } from "../types/forensic";

interface EvidenceIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoSamples: DemoSampleMeta[];
  selectedSampleId: string | null;
  onSelectSample: (sampleId: string) => void;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export const EvidenceIntakeModal: React.FC<EvidenceIntakeModalProps> = ({
  isOpen,
  onClose,
  demoSamples,
  selectedSampleId,
  onSelectSample,
  onFileUpload,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<"UPLOAD" | "DEMO">("UPLOAD");
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedPreview, setStagedPreview] = useState<string | null>(null);
  const [stagedMetadata, setStagedMetadata] = useState<{
    width: number;
    height: number;
    size: string;
    sha256?: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset staged file when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setStagedFile(null);
      setStagedPreview(null);
      setStagedMetadata(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Process file for pre-flight inspection
  const handleStageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file (PNG, JPG, WebP, BMP).");
      return;
    }

    setStagedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setStagedPreview(previewUrl);

    // Compute dimensions and local SHA-256
    const img = new Image();
    img.src = previewUrl;
    img.onload = async () => {
      let hash = "";
      try {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      } catch {
        hash = "Generated during server analysis";
      }

      setStagedMetadata({
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        sha256: hash,
      });
    };
  };

  const handleStartInvestigation = () => {
    if (stagedFile) {
      onFileUpload(stagedFile);
      onClose();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleStageFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intake-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0b1120] border border-[#1e293b] shadow-2xl overflow-hidden text-[#f1f5f9]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#070b14]/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="intake-title" className="text-base font-bold tracking-tight text-white">
                  Stage 1: Evidence Intake & Case Initialization
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 font-semibold uppercase">
                  Intake Gate
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Load digital screenshot evidence or choose a benchmark demonstration scenario
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Evidence Intake"
            className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#1e293b] bg-[#070b14]/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab("UPLOAD")}
            className={`flex items-center space-x-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "UPLOAD"
                ? "border-sky-400 text-sky-300"
                : "border-transparent text-[#94a3b8] hover:text-white"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Custom Evidence</span>
          </button>

          <button
            onClick={() => setActiveTab("DEMO")}
            className={`flex items-center space-x-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "DEMO"
                ? "border-sky-400 text-sky-300"
                : "border-transparent text-[#94a3b8] hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Benchmark Scenarios (5 Golden Cases)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activeTab === "UPLOAD" ? (
            <div className="space-y-4">
              {/* Dropzone */}
              {!stagedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-sky-400 bg-sky-950/30 scale-[0.99]"
                      : "border-[#334155] bg-[#070b14]/50 hover:border-sky-500/60 hover:bg-[#070b14]/80"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleStageFile(e.target.files[0])}
                    accept="image/png,image/jpeg,image/webp,image/bmp"
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 shadow-lg shadow-sky-500/10">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Drag & Drop Digital Evidence Screenshot
                  </h3>
                  <p className="text-xs text-[#94a3b8] mt-1 max-w-sm">
                    Select a payment confirmation receipt, chat screenshot, or wallet snapshot.
                  </p>
                  <div className="flex items-center space-x-3 mt-4 text-[11px] font-mono text-[#64748b]">
                    <span>Format: PNG, JPG, WebP, BMP</span>
                    <span>•</span>
                    <span>Max Size: 20 MB</span>
                    <span>•</span>
                    <span>Local & Private</span>
                  </div>
                </div>
              ) : (
                /* Staged Evidence Preview & Metadata Confirmation */
                <div className="bg-[#070b14] border border-[#1e293b] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                    <div className="flex items-center space-x-2.5">
                      <FileImage className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white truncate max-w-[280px]">
                        {stagedFile.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setStagedFile(null);
                        setStagedPreview(null);
                        setStagedMetadata(null);
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 font-mono underline"
                    >
                      Choose Different File
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Visual Preview */}
                    <div className="md:col-span-4 bg-black/60 rounded-xl p-2 border border-[#1e293b] flex items-center justify-center max-h-48 overflow-hidden">
                      {stagedPreview && (
                        <img
                          src={stagedPreview}
                          alt="Staged Evidence"
                          className="max-h-44 object-contain rounded-lg"
                        />
                      )}
                    </div>

                    {/* Pre-flight Technical Telemetry */}
                    <div className="md:col-span-8 space-y-2 text-xs font-mono">
                      <div className="bg-[#0b1120] p-2.5 rounded-lg border border-[#1e293b] flex items-center justify-between">
                        <span className="text-[#94a3b8] flex items-center space-x-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>Framebuffer Dimensions:</span>
                        </span>
                        <span className="text-white font-bold">
                          {stagedMetadata?.width} × {stagedMetadata?.height} px
                        </span>
                      </div>

                      <div className="bg-[#0b1120] p-2.5 rounded-lg border border-[#1e293b] flex items-center justify-between">
                        <span className="text-[#94a3b8] flex items-center space-x-1.5">
                          <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Payload Size:</span>
                        </span>
                        <span className="text-white font-bold">{stagedMetadata?.size}</span>
                      </div>

                      <div className="bg-[#0b1120] p-2.5 rounded-lg border border-[#1e293b] flex items-center justify-between">
                        <span className="text-[#94a3b8] flex items-center space-x-1.5">
                          <Hash className="w-3.5 h-3.5 text-emerald-400" />
                          <span>SHA-256 Digest:</span>
                        </span>
                        <span className="text-emerald-400 font-mono text-[10px] truncate max-w-[200px]" title={stagedMetadata?.sha256}>
                          {stagedMetadata?.sha256?.substring(0, 18)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Trigger */}
                  <div className="pt-2 flex items-center justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-[#94a3b8] hover:text-white bg-[#1e293b] hover:bg-[#334155] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStartInvestigation}
                      disabled={isLoading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-sky-500/25 flex items-center space-x-2 transition-all"
                    >
                      <span>START 4-LAYER INVESTIGATION</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Informational Guidelines */}
              <div className="p-3.5 rounded-xl bg-[#070b14]/60 border border-[#1e293b] text-xs text-[#94a3b8] flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-[#f1f5f9]">Intake Evidence Integrity Protocol:</span>
                  <p className="text-[11px] leading-relaxed text-[#64748b]">
                    Original bytes are preserved and cryptographically digested with SHA-256 upon intake. Heuristic indicators do not definitively prove intentional fraud; always verify transactions directly with the issuing financial institution.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Benchmark Scenarios Tab */
            <div className="space-y-3">
              <div className="text-xs text-[#94a3b8] mb-2 flex items-center justify-between">
                <span>Select a controlled synthetic benchmark scenario:</span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                  Labeled Demonstration Cases
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {demoSamples.map((sample, idx) => {
                  const isSelected = selectedSampleId === sample.id;
                  const isClean = sample.id === "sample_1";

                  return (
                    <button
                      key={sample.id}
                      onClick={() => {
                        onSelectSample(sample.id);
                        onClose();
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-sky-950/40 border-sky-500 shadow-md shadow-sky-500/10"
                          : "bg-[#070b14] border-[#1e293b] hover:border-[#334155] hover:bg-[#070b14]/80"
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">
                            Case S{idx + 1}: {sample.title}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase border ${
                              isClean
                                ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                : "bg-rose-950 text-rose-300 border-rose-800"
                            }`}
                          >
                            {isClean ? "Clean Baseline" : "Synthetic Forgery"}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#94a3b8] line-clamp-2">
                          {sample.scenario}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {sample.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-[#64748b] block">Expected Score</span>
                        <span className="text-xs font-mono font-bold text-[#f1f5f9]">
                          {sample.target_score_range}
                        </span>
                        <span className="mt-2 text-xs text-sky-400 font-medium flex items-center space-x-1 justify-end">
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
