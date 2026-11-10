import React, { useEffect, useState } from "react";
import { TopCommandBar } from "./components/TopCommandBar";
import { ForensicViewer } from "./components/ForensicViewer";
import { RiskDossierSidebar } from "./components/RiskDossierSidebar";
import { WhatsAppSimulatorModal } from "./components/WhatsAppSimulatorModal";
import { MobileUploadModal } from "./components/MobileUploadModal";
import { MobileUploadView } from "./components/MobileUploadView";
import { ForensicReportModal } from "./components/ForensicReportModal";
import { Section91NoticeModal } from "./components/Section91NoticeModal";
import { EvidenceIntakeModal } from "./components/EvidenceIntakeModal";
import { RiskThresholdModal } from "./components/RiskThresholdModal";
import { AtmosphericBackground } from "./components/ui/AtmosphericBackground";
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
  fetchHealth,
} from "./services/api";
import {
  evaluateRiskState,
  getSavedCriticalThreshold,
  saveCriticalThreshold,
  applyRiskCssVariables,
  RiskState,
} from "./services/riskTheme";

export const App: React.FC = () => {
  const isMobileMode =
    new URLSearchParams(window.location.search).get("mode") === "mobile";
  return isMobileMode ? <MobileUploadView /> : <DesktopWorkbench />;
};

const DesktopWorkbench: React.FC = () => {
  // Desktop Workbench State
  const [demoSamples, setDemoSamples] = useState<DemoSampleMeta[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(
    "sample_1",
  );
  const [report, setReport] = useState<ForensicAnalysisReport | null>(null);
  const [appError, setAppError] = useState<string | null>(null);
  const [selectedLocus, setSelectedLocus] = useState<BoundingBox | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [databaseStatus, setDatabaseStatus] = useState<
    "CHECKING" | "HEALTHY" | "UNAVAILABLE" | "NOT_CONFIGURED"
  >("CHECKING");
  const [demoLoadFailed, setDemoLoadFailed] = useState(false);
  const [demoRetry, setDemoRetry] = useState(0);

  // 5-Stage Investigation Workflow state
  const [activeStage, setActiveStage] = useState<
    "INTAKE" | "ANALYSIS" | "CANVAS" | "RISK" | "DOSSIER"
  >("CANVAS");

  // Configurable Risk Threshold State (Default 87.0)
  const [criticalThreshold, setCriticalThreshold] = useState<number>(
    getSavedCriticalThreshold,
  );
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);

  // Collapsible Dossier State
  const [isDossierCollapsed, setIsDossierCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("verisight_dossier_collapsed") === "true";
    }
    return false;
  });

  const handleToggleDossier = () => {
    setIsDossierCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("verisight_dossier_collapsed", String(next));
      }
      return next;
    });
  };

  const handleSaveThreshold = (newThreshold: number) => {
    saveCriticalThreshold(newThreshold);
    setCriticalThreshold(newThreshold);
  };

  // Centralized Dynamic Risk State
  const riskState: RiskState = evaluateRiskState(
    report?.overall_tamper_score,
    criticalThreshold,
  );

  // Apply CSS custom properties to documentElement whenever riskState updates
  useEffect(() => {
    applyRiskCssVariables(riskState);
  }, [riskState]);

  // Modals state
  const [isEvidenceIntakeOpen, setIsEvidenceIntakeOpen] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [isWhatsAppLoading, setIsWhatsAppLoading] = useState<boolean>(false);
  const [whatsAppData, setWhatsAppDat] =
    useState<WhatsAppSimulationResponse | null>(null);

  const [isMobileModalOpen, setIsMobileModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isSection91ModalOpen, setIsSection91ModalOpen] = useState<boolean>(false);

  // Request health and demo samples catalog on mount
  useEffect(() => {
    let active = true;
    fetchHealth()
      .then((health) => {
        if (active) setDatabaseStatus(health.database);
      })
      .catch(() => {
        if (active) setDatabaseStatus("UNAVAILABLE");
      });

    const catalogRequest = fetchDemoSamples()
      .then((samples) => {
        if (!active) return;
        setDemoSamples(samples);
        setDemoLoadFailed(false);
        if (samples.length === 0) {
          setAppError("The demo sample list is empty.");
        }
      })
      .catch((err) => {
        if (!active) return;
        setDemoLoadFailed(true);
        setAppError(`Could not load demo samples: ${err.message}`);
      });
    void catalogRequest;
    void handleSelectSample("sample_1");
    return () => {
      active = false;
    };
  }, [demoRetry]);

  // Handle selecting a golden demo sample
  async function handleSelectSample(sampleId: string) {
    setSelectedSampleId(sampleId);
    setSelectedLocus(null);
    setIsLoading(true);
    setAppError(null);
    setActiveStage("CANVAS");

    try {
      const res = await analyzeDemoSample(sampleId);
      setReport(res);
    } catch (err) {
      setAppError(
        `Sample analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Handle custom screenshot upload
  const handleFileUpload = async (file: File) => {
    setSelectedSampleId(null);
    setSelectedLocus(null);
    setIsLoading(true);
    setAppError(null);
    setActiveStage("CANVAS");

    try {
      const res = await analyzeUpload(file);
      setReport(res);
    } catch (err) {
      setAppError(
        `Upload analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle stage selection in TopCommandBar
  const handleStageSelect = (
    stage: "INTAKE" | "ANALYSIS" | "CANVAS" | "RISK" | "DOSSIER",
  ) => {
    setActiveStage(stage);
    if (stage === "INTAKE") {
      setIsEvidenceIntakeOpen(true);
    } else if (stage === "DOSSIER") {
      setIsReportModalOpen(true);
    }
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
      const previewMime =
        report.original_image_b64.match(/^data:([^;]+);/)?.[1] || "image/png";
      const blob = new Blob([byteArray], { type: previewMime });

      const simRes = await simulateWhatsApp(
        blob,
        report.filename || "screenshot.png",
      );
      setWhatsAppDat(simRes);
    } catch (err) {
      setAppError(
        `WhatsApp simulation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsWhatsAppLoading(false);
    }
  };

  // Handle stage judge live mobile upload arrival
  const handleMobileUploadReceived = (newReport: ForensicAnalysisReport) => {
    setSelectedSampleId(null);
    setSelectedLocus(null);
    setReport(newReport);
    setActiveStage("CANVAS");
  };

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] w-full flex-col overflow-hidden bg-[#070b14] text-[#f8fafc] md:h-screen md:min-h-0">
      {/* Dynamic Risk Atmospheric Background */}
      <AtmosphericBackground riskState={riskState} />

      {/* Top Command Bar (Simplified single 60px row + compact scenario popover + actions menu) */}
      <TopCommandBar
        databaseStatus={databaseStatus}
        demoSamples={demoSamples}
        selectedSampleId={selectedSampleId}
        report={report}
        riskState={riskState}
        onSelectSample={handleSelectSample}
        onFileUpload={handleFileUpload}
        onOpenIntakeModal={() => setIsEvidenceIntakeOpen(true)}
        onOpenWhatsAppModal={handleTriggerWhatsAppSimulation}
        onOpenMobileModal={() => setIsMobileModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSection91Modal={() => setIsSection91ModalOpen(true)}
        onOpenThresholdModal={() => setIsThresholdModalOpen(true)}
        onStageSelect={handleStageSelect}
        activeStage={activeStage}
        isLoading={isLoading}
      />

      {/* Application Alerts */}
      {appError && (
        <div
          role="alert"
          className="relative z-30 px-4 py-2 bg-rose-950/90 border-b border-rose-800 text-rose-200 text-xs flex items-center justify-between shadow-lg"
        >
          <span>{appError}</span>
          <div className="ml-4 flex shrink-0 items-center gap-3">
            {demoLoadFailed && (
              <button
                onClick={() => setDemoRetry((n) => n + 1)}
                className="text-rose-100 underline hover:text-white"
              >
                Retry
              </button>
            )}
            <button
              onClick={() => setAppError(null)}
              className="text-rose-100 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Forensic Investigation Workbench (~72% evidence canvas / 28% collapsible dossier) */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
        {/* Centerpiece Evidence Workspace */}
        <ForensicViewer
          report={report}
          selectedLocus={selectedLocus}
          onSelectLocus={(box) => setSelectedLocus(box)}
          riskState={riskState}
          onOpenSection91={() => setIsSection91ModalOpen(true)}
          onOpenDossier={() => setIsReportModalOpen(true)}
          onOpenThresholdModal={() => setIsThresholdModalOpen(true)}
          isDossierCollapsed={isDossierCollapsed}
          onToggleDossier={handleToggleDossier}
        />

        {/* Right Forensic Risk Dossier (Collapsible to 52px rail or full 384px) */}
        <RiskDossierSidebar
          report={report}
          selectedLocus={selectedLocus}
          riskState={riskState}
          onSelectLocus={(box) => setSelectedLocus(box)}
          onOpenSection91Modal={() => setIsSection91ModalOpen(true)}
          onOpenThresholdModal={() => setIsThresholdModalOpen(true)}
          isCollapsed={isDossierCollapsed}
          onToggleCollapse={handleToggleDossier}
        />
      </div>

      {/* STAGE 1: Evidence Intake Modal */}
      <EvidenceIntakeModal
        isOpen={isEvidenceIntakeOpen}
        onClose={() => setIsEvidenceIntakeOpen(false)}
        demoSamples={demoSamples}
        selectedSampleId={selectedSampleId}
        onSelectSample={(sampleId) => {
          handleSelectSample(sampleId);
          setIsEvidenceIntakeOpen(false);
        }}
        onFileUpload={(file) => {
          handleFileUpload(file);
          setIsEvidenceIntakeOpen(false);
        }}
        isLoading={isLoading}
      />

      {/* Configurable Risk Threshold Modal */}
      <RiskThresholdModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        currentThreshold={criticalThreshold}
        currentScore={report?.overall_tamper_score}
        onSaveThreshold={handleSaveThreshold}
      />

      {/* WhatsApp Re-Compression Simulator Modal */}
      <WhatsAppSimulatorModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        simulationData={whatsAppData}
        isLoading={isWhatsAppLoading}
        onApplyLaunderedImage={(newReport) => setReport(newReport)}
      />

      {/* Judge Stage QR Mobile Upload Modal */}
      <MobileUploadModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        onMobileUploadReceived={handleMobileUploadReceived}
      />

      {/* Comprehensive Forensic Dossier Modal */}
      <ForensicReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={report}
      />

      {/* Section 91 Cr.P.C. Statutory Notice Modal */}
      {isSection91ModalOpen && report && (
        <Section91NoticeModal
          report={report}
          onClose={() => setIsSection91ModalOpen(false)}
        />
      )}
    </div>
  );
};
