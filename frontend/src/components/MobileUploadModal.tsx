import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  X,
  QrCode,
  Smartphone,
  Copy,
  Check,
  Radio,
  Loader2,
  Sparkles,
} from "lucide-react";
import { NetworkInfo, ForensicAnalysisReport } from "../types/forensic";
import { fetchNetworkInfo, fetchLatestMobileUpload } from "../services/api";

interface MobileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMobileUploadReceived: (report: ForensicAnalysisReport) => void;
}

export const MobileUploadModal: React.FC<MobileUploadModalProps> = ({
  isOpen,
  onClose,
  onMobileUploadReceived,
}) => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(true);

  // Load network info on open
  useEffect(() => {
    if (!isOpen) return;

    fetchNetworkInfo()
      .then((info) => setNetworkInfo(info))
      .catch((err) => console.error("Failed to load network info:", err));
  }, [isOpen]);

  // Live polling for stage judge uploads
  useEffect(() => {
    if (!isOpen || !isListening) return;

    const interval = setInterval(async () => {
      try {
        const latestReport = await fetchLatestMobileUpload();
        if (latestReport) {
          onMobileUploadReceived(latestReport);
          onClose();
        }
      } catch (e) {
        // Ignore polling errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, isListening, onMobileUploadReceived, onClose]);

  if (!isOpen) return null;

  const mobileUrl =
    networkInfo?.mobile_upload_url ||
    `http://${window.location.hostname}:5173/?mode=mobile`;

  const copyUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="watermelon-glass border border-white/[0.1] rounded-3xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="h-16 px-6 border-b border-white/[0.08] bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white tracking-wide">
                Stage Judge Wireless Mobile Upload
              </h3>
              <p className="text-[11px] text-slate-400">
                Zero-cable live intake direct from judge smartphone camera
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Body */}
        <div className="p-6 flex flex-col items-center space-y-5">
          <div className="p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-amber-400/40">
            <QRCodeSVG
              value={mobileUrl}
              size={220}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Pulse Status */}
          <div className="flex items-center space-x-2 text-xs font-mono text-watermelon-mint bg-watermelon-emerald/15 border border-watermelon-emerald/40 px-3.5 py-1.5 rounded-full">
            <Radio className="w-3.5 h-3.5 animate-pulse text-watermelon-emerald" />
            <span className="font-semibold tracking-wider">LISTENING FOR WIRELESS MOBILE UPLOAD...</span>
          </div>

          {/* Direct URL */}
          <div className="w-full watermelon-glass-card rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-mono text-xs text-slate-300 truncate">
                {mobileUrl}
              </span>
            </div>
            <button
              onClick={copyUrl}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 transition-all shrink-0 ml-2 border border-white/[0.06]"
              title="Copy mobile upload URL"
            >
              {copied ? (
                <Check className="w-4 h-4 text-watermelon-emerald" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Instructions for HackStellar Judges */}
          <div className="w-full text-[11px] text-slate-400 space-y-1 text-center leading-relaxed font-mono">
            <p>1. Connect smartphone to the same Wi-Fi / Local Area Network.</p>
            <p>2. Scan QR with iOS Camera or Android Google Lens.</p>
            <p className="text-slate-300">
              3. Snap any UPI screenshot to trigger instant 4-layer audit on this screen.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-6 border-t border-white/[0.08] bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
