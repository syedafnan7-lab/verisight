import React, { useEffect, useState, useRef } from "react";
import { NavigationSidebar } from "./components/NavigationSidebar";
import { TopHeaderBar } from "./components/TopHeaderBar";
import { ForensicViewer } from "./components/ForensicViewer";
import { RiskDossierSidebar } from "./components/RiskDossierSidebar";
import { BentoCaseDashboard } from "./components/BentoCaseDashboard";
import { WhatsAppSimulatorModal } from "./components/WhatsAppSimulatorModal";
import { MobileUploadModal } from "./components/MobileUploadModal";
import { MobileUploadView } from "./components/MobileUploadView";
import { ForensicReportModal } from "./components/ForensicReportModal";
import { Section91NoticeModal } from "./components/Section91NoticeModal";
import { UploadCloud } from "lucide-react";
import {
  ForensicAnalysisReport,
  DemoSampleMeta,
  WhatsAppSimulationResponse,
  BoundingBox,
} from "./types/forensic";
import {
  fetchDemoSamples,
  analyzeDemoSample,
  analyzeUpload,
  simulateWhatsApp,
} from "./services/api";

export const App: React.FC = () => {
  // Check if mobile mode is requested (?mode=mobile)
  const isMobileMode =
    new URLSearchParams(window.location.search).get("mode") === "mobile";

  if (isMobileMode) {
    return <MobileUploadView />;
  }

  // Active view: Bento Dashboard or Deep Inspector
  const [activeView, setActiveView] = useState<"DASHBOARD" | "INSPECTOR">(
    "DASHBOARD",
  );

  // Desktop Workbench State
  const [demoSamples, setDemoSamples] = useState<DemoSampleMeta[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(
    "sample_1",
  );
  const [report, setReport] = useState<ForensicAnalysisReport | null>(null);
  const [selectedLocus, setSelectedLocus] = useState<BoundingBox | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals state
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] =
    useState<boolean>(false);
  const [isWhatsAppLoading, setIsWhatsAppLoading] = useState<boolean>(false);
  const [whatsAppData, setWhatsAppDat] =
    useState<WhatsAppSimulationResponse | null>(null);

  const [isMobileModalOpen, setIsMobileModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isSection91ModalOpen, setIsSection91ModalOpen] = useState<boolean>(false);

  // Load demo samples list and analyze sample_1 on startup
  useEffect(() => {
    fetchDemoSamples()
      .then((samples) => {
        setDemoSamples(samples);
        if (samples.length > 0) {
          handleSelectSample("sample_1");
        }
      })
      .catch((err) => console.error("Failed to load demo samples:", err));
  }, []);

  // Handle selecting a golden demo sample
  const handleSelectSample = async (sampleId: string) => {
    setSelectedSampleId(sampleId);
    setSelectedLocus(null);
    setIsLoading(true);

    try {
      const res = await analyzeDemoSample(sampleId);
      setReport(res);
    } catch (err) {
      console.error("Failed to analyze sample:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle custom screenshot upload
  const handleFileUpload = async (file: File) => {
    setSelectedSampleId(null);
    setSelectedLocus(null);
    setIsLoading(true);

    try {
      const res = await analyzeUpload(file);
      setReport(res);
    } catch (err: any) {
      alert(`Upload Analysis Failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Switch to Deep Inspector and focus locus
  const handleSwitchToInspector = (locus?: BoundingBox) => {
    if (locus) {
      setSelectedLocus(locus);
    }
    setActiveView("INSPECTOR");
  };

  // Handle WhatsApp simulation on current screenshot
  const handleTriggerWhatsAppSimulation = async () => {
    if (!report) return;
    setIsWhatsAppModalOpen(true);
    setIsWhatsAppLoading(true);

    try {
      const base64Data =
        report.original_image_b64.split(",")[1] || report.original_image_b64;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      const simRes = await simulateWhatsApp(
        blob,
        report.filename || "screenshot.png",
      );
      setWhatsAppDat(simRes);
    } catch (err) {
      console.error("WhatsApp simulation failed:", err);
    } finally {
      setIsWhatsAppLoading(false);
    }
  };

  // Handle stage judge live mobile upload arrival
  const handleMobileUploadReceived = (newReport: ForensicAnalysisReport) => {
    setSelectedSampleId(null);
    setSelectedLocus(null);
    setReport(newReport);
    setActiveView("DASHBOARD");
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="h-screen w-screen flex bg-[#080c16] overflow-hidden relative font-sans text-slate-100"
    >
      {/* Hidden Global File Input for Header Shortcuts */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleGlobalFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Global Drag-and-Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 border-4 border-dashed border-watermelon-coral animate-in fade-in duration-150">
          <div className="w-20 h-20 rounded-3xl bg-watermelon-coral/15 border border-watermelon-coral/40 flex items-center justify-center mb-4">
            <UploadCloud className="w-10 h-10 text-watermelon-coral animate-bounce" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Drop Forensic Screenshot to Inspect
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-2">
            Auto-executes 4-Layer Signal, OCR Baseline Lasers & Viewport Audit
          </p>
        </div>
      )}

      {/* Main Interactive Workbench (Guaranteed hidden during PDF Print) */}
      <div className="flex h-full w-full no-print">
        {/* Left Navigation Sidebar */}
        <NavigationSidebar
          demoSamples={demoSamples}
          selectedSampleId={selectedSampleId}
          onSelectSample={handleSelectSample}
          onFileUpload={handleFileUpload}
          onOpenWhatsAppModal={handleTriggerWhatsAppSimulation}
          onOpenMobileModal={() => setIsMobileModalOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          isLoading={isLoading}
        />

        {/* Main Right Workspace Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
          {/* Top Header Bar featuring React Bits PillNav */}
          <TopHeaderBar
            report={report}
            activeView={activeView}
            onViewChange={(v) => setActiveView(v)}
          />

          {/* Dynamic Main View */}
          <div className="flex-1 flex overflow-hidden relative">
            {activeView === "DASHBOARD" ? (
              /* Bento Intelligence Dashboard View */
              <BentoCaseDashboard
                report={report}
                onSwitchToInspector={handleSwitchToInspector}
                onOpenWhatsAppModal={handleTriggerWhatsAppSimulation}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onOpenMobileModal={() => setIsMobileModalOpen(true)}
                onOpenSection91Modal={() => setIsSection91ModalOpen(true)}
              />
            ) : (
              /* Deep Inspector Workbench */
              <div className="flex-1 flex overflow-hidden w-full">
                <ForensicViewer report={report} selectedLocus={selectedLocus} />
                <RiskDossierSidebar
                  report={report}
                  selectedLocus={selectedLocus}
                  onSelectLocus={(box) => setSelectedLocus(box)}
                  onOpenSection91Modal={() => setIsSection91ModalOpen(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <WhatsAppSimulatorModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        simulationData={whatsAppData}
        isLoading={isWhatsAppLoading}
        onApplyLaunderedImage={(newReport) => {
          setReport(newReport);
          setActiveView("DASHBOARD");
        }}
      />

      <MobileUploadModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        onMobileUploadReceived={handleMobileUploadReceived}
      />

      <ForensicReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={report}
      />

      {isSection91ModalOpen && report && (
        <Section91NoticeModal
          report={report}
          onClose={() => setIsSection91ModalOpen(false)}
        />
      )}
    </div>
  );
};
