import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { uploadMobile } from "../services/api";

export const MobileUploadView: React.FC = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setIsUploading(true);
    setErrorMsg(null);

    try {
      await uploadMobile(file);
      setUploaded(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c16] text-[#f8fafc] flex flex-col items-center justify-between p-6">
      {/* Mobile Top Header */}
      <div className="w-full flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-watermelon-coral via-watermelon-crimson to-watermelon-rind p-0.5 shadow-lg shadow-watermelon-coral/25">
            <div className="w-full h-full bg-[#080c16] rounded-[10px] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-watermelon-coral" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wide text-white">
              VERISIGHT
            </h1>
            <span className="text-[10px] font-mono text-slate-400">
              STAGE JUDGE LIVE INTAKE
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-watermelon-emerald/15 text-watermelon-mint border border-watermelon-emerald/40 font-semibold">
          LIVE CONNECTED
        </span>
      </div>

      {/* Main Upload Body */}
      <div className="w-full max-w-sm flex-1 flex flex-col items-center justify-center my-8 text-center space-y-6">
        {uploaded ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-3xl bg-watermelon-emerald/15 border-2 border-watermelon-emerald/50 flex items-center justify-center mx-auto shadow-xl shadow-watermelon-emerald/20">
              <CheckCircle2 className="w-10 h-10 text-watermelon-mint" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white">
                Evidence Transmitted!
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Your mobile payment screenshot was received. Look at the desktop
                workbench to view the live 4-layer forensic investigation!
              </p>
            </div>
            <button
              onClick={() => {
                setUploaded(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="mt-4 px-5 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition-all inline-flex items-center space-x-2 border border-white/10 shadow-sm"
            >
              <span>Upload Another Screenshot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Stage Judge Capture
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take a photo or choose any digital payment screenshot from your
                phone to run real-time forensic tamper analysis on the stage screen.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFile}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-5 rounded-3xl bg-gradient-to-r from-watermelon-coral via-watermelon-crimson to-rose-600 hover:from-watermelon-rose hover:to-watermelon-coral font-bold text-sm text-white shadow-xl shadow-watermelon-coral/30 transition-all flex flex-col items-center justify-center space-y-2 active:scale-95 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                  <span className="font-mono text-xs">
                    TRANSMITTING EVIDENCE PAYLOAD...
                  </span>
                </>
              ) : (
                <>
                  <Camera className="w-9 h-9 text-white" />
                  <span className="text-base tracking-wide">SNAP OR CHOOSE EVIDENCE</span>
                  <span className="text-[10px] font-normal text-rose-200 font-mono">
                    iOS & Android Camera Ready
                  </span>
                </>
              )}
            </button>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-2xl border border-rose-800">
                {errorMsg}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full border-t border-white/[0.08] pt-3 text-center text-[10px] font-mono text-slate-500">
        VeriSight Forensics Engine // HackStellar Problem Statement 12
      </div>
    </div>
  );
};
