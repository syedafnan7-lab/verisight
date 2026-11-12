import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  FileText,
  CreditCard,
  QrCode,
  UserX,
  ShoppingBag,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { REAL_WORLD_CASES, RealWorldFraudCase } from "../data/realWorldCases";
import { DottedIndiaMap } from "./common/DottedIndiaMap";
import { CaseInvestigationModal } from "./CaseInvestigationModal";

interface RealWorldCaseShowcaseProps {
  onNavigateWorkbench?: () => void;
  onNavigateResponse?: (category?: string) => void;
  initialCategoryFilter?: string;
  className?: string;
}

export const RealWorldCaseShowcase: React.FC<RealWorldCaseShowcaseProps> = ({
  onNavigateWorkbench,
  onNavigateResponse,
  initialCategoryFilter = "ALL",
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter);
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [investigatingCase, setInvestigatingCase] = useState<RealWorldFraudCase | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);

  // Filter cases based on selected category
  const filteredCases = React.useMemo(() => {
    if (selectedCategory === "ALL") return REAL_WORLD_CASES;
    return REAL_WORLD_CASES.filter((c) => c.categoryCode === selectedCategory);
  }, [selectedCategory]);

  // Ensure index remains in bounds when filter changes
  useEffect(() => {
    if (activeCaseIndex >= filteredCases.length) {
      setActiveCaseIndex(0);
    }
  }, [filteredCases.length, activeCaseIndex]);

  const activeCase = filteredCases[activeCaseIndex] || filteredCases[0];

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveCaseIndex((prev) => (prev > 0 ? prev - 1 : filteredCases.length - 1));
  }, [filteredCases.length]);

  const handleNext = useCallback(() => {
    setActiveCaseIndex((prev) => (prev < filteredCases.length - 1 ? prev + 1 : 0));
  }, [filteredCases.length]);

  const handleSelectCaseById = useCallback(
    (caseId: string) => {
      const idx = filteredCases.findIndex((c) => c.id === caseId);
      if (idx !== -1) {
        setActiveCaseIndex(idx);
      } else {
        // If not in current category filter, reset to ALL
        setSelectedCategory("ALL");
        const allIdx = REAL_WORLD_CASES.findIndex((c) => c.id === caseId);
        if (allIdx !== -1) {
          setActiveCaseIndex(allIdx);
        }
      }
    },
    [filteredCases]
  );

  // Keyboard navigation (Left / Right arrow keys when container is focused or visible)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Category filter list
  const CATEGORY_FILTERS = [
    { id: "ALL", label: "All Documented Cases" },
    { id: "FAKE_PAYMENT_SCREENSHOT", label: "Fake Screenshots" },
    { id: "IMPERSONATION", label: "Digital Impersonation" },
    { id: "QR_CODE_FRAUD", label: "QR Code Scams" },
    { id: "ONLINE_MARKETPLACE_FRAUD", label: "Marketplace Fraud" },
    { id: "PAYMENT_FRAUD", label: "Institutional Fraud" },
  ];

  return (
    <section
      id="real-world-cases"
      className={`relative w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#080E1C] via-[#060A14] to-[#04070D] p-6 sm:p-10 lg:p-12 shadow-2xl ${className}`}
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 right-10 h-96 w-96 rounded-full bg-amber-500/10 blur-[130px]" />

      {/* Main Grid: Left Column (38%) & Right Column (62%) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* =========================================================================
            LEFT COLUMN: EDITORIAL STORYTELLING & DOTTED INDIA MAP
        ========================================================================= */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-4">
            {/* Section Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/60 px-3.5 py-1 text-xs font-mono text-sky-400">
              <ShieldAlert className="h-3.5 w-3.5 text-sky-400" />
              <span>VERISIGHT INTELLIGENCE // DOCUMENTED EVIDENCE</span>
            </div>

            {/* Expressive Editorial Headline */}
            <h2 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold text-white leading-tight font-sans tracking-tight">
              These scams happened to real people.{" "}
              <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Their evidence tells a story.
              </span>
            </h2>

            {/* Introductory Narrative Prose */}
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Every fraudulent payment leaves a digital trail. Explore documented incidents of UPI manipulation,
              forged banking vouchers, and digital impersonation across India. Understand how these scams occurred,
              recognize critical warning signs, and discover how VeriSight investigates suspicious evidence.
            </p>

            {/* Curated Trust Indicator */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Curated from verified police FIRs, RBI advisories & news archives</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveCaseIndex(0);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition-all ${
                    selectedCategory === cat.id
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm font-semibold"
                      : "border border-white/[0.06] bg-[#0A1020] text-slate-400 hover:text-slate-200 hover:border-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dotted India Map Visualization with Active Incident Coordinates */}
          <div className="pt-4 border-t border-white/[0.08]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-2">
              Geographic Incident Coordinates (India)
            </span>
            <DottedIndiaMap
              cases={filteredCases}
              activeCaseId={activeCase?.id || ""}
              onSelectCase={handleSelectCaseById}
            />
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: LAYERED CASE STUDY CAROUSEL (SCAMSHIELD INSPIRATION)
        ========================================================================= */}
        <div
          ref={carouselContainerRef}
          className="lg:col-span-7 flex flex-col justify-between space-y-6"
        >
          {/* Carousel Top Controls: Navigation Arrows & Case Counter */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-200">
                CASE {String(activeCaseIndex + 1).padStart(2, "0")} OF {String(filteredCases.length).padStart(2, "0")}
              </span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-[11px] text-sky-400">
                {activeCase?.city}, {activeCase?.state}
              </span>
            </div>

            {/* Circular Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0C1428] text-slate-300 hover:border-sky-500/40 hover:bg-sky-950/60 hover:text-white transition-all active:scale-95 shadow-md"
                aria-label="Previous case"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0C1428] text-slate-300 hover:border-sky-500/40 hover:bg-sky-950/60 hover:text-white transition-all active:scale-95 shadow-md"
                aria-label="Next case"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Interactive Layered Card Stage */}
          <div className="relative min-h-[460px] flex items-center justify-center overflow-visible">
            <AnimatePresence mode="wait">
              {activeCase && (
                <motion.div
                  key={activeCase.id}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -24, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full rounded-2xl border border-white/[0.12] bg-[#0A1022]/95 p-6 shadow-2xl backdrop-blur-xl space-y-5 hover:border-sky-500/40 transition-colors group relative"
                >
                  {/* Decorative Card Header Visual Banner */}
                  <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-r from-[#0C152E] via-[#0E1A38] to-[#0A1224] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-rose-950 px-2 py-0.5 font-mono text-[9px] font-bold text-rose-300 border border-rose-800/50 uppercase tracking-wider">
                          REPORTED CASE
                        </span>
                        <span className="font-mono text-xs text-sky-400 font-semibold">
                          {activeCase.scamCategory}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        <span>{activeCase.incidentMonthYear}</span>
                      </div>
                    </div>

                    {/* Headline */}
                    <h3 className="mt-3 text-base sm:text-lg font-bold text-white leading-snug group-hover:text-sky-200 transition-colors">
                      {activeCase.headline}
                    </h3>

                    {/* Large Prominent Financial Loss Figure */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-baseline justify-between">
                      <div>
                        <span className="block font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                          Reported Financial Loss
                        </span>
                        <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
                          {activeCase.reportedLoss}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[10px] text-slate-400 block uppercase">
                          Location
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-200 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-sky-400" />
                          {activeCase.city}, {activeCase.state}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Incident Summary */}
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                      Incident Summary
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {activeCase.summary}
                    </p>
                  </div>

                  {/* Prevention Insight Box (ScamShield Feature) */}
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-300 uppercase">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>What Could Have Helped Prevent It?</span>
                    </div>
                    <p className="text-xs text-emerald-200/90 leading-relaxed font-sans">
                      {activeCase.preventionInsight}
                    </p>
                  </div>

                  {/* How VeriSight Relates to This Case */}
                  <div className="rounded-xl border border-sky-500/25 bg-[#070D1B] p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-sky-300 uppercase">
                        <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                        <span>How VeriSight Relates to This Case</span>
                      </div>
                      <span className="font-mono text-[9px] text-slate-400">
                        Forensic Relevance
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      <strong className="text-sky-300">{activeCase.verisightRelevance.forensicLayer}:</strong>{" "}
                      {activeCase.verisightRelevance.examination}
                    </p>
                  </div>

                  {/* Card Bottom: Source Attribution & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                      <span>Source:</span>
                      <a
                        href={activeCase.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{activeCase.publisher}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInvestigatingCase(activeCase)}
                      className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/15 px-3.5 py-1.5 font-mono text-xs font-semibold text-sky-300 hover:bg-sky-500/25 transition-all active:scale-[0.98]"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Investigate Case Dossier</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Progress Indicator Strip */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              {filteredCases.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCaseIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeCaseIndex
                      ? "w-8 bg-sky-400"
                      : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to case ${i + 1}: ${c.city}`}
                />
              ))}
            </div>

            <span className="font-mono text-[10px] text-slate-500">
              Use Left/Right arrow keys or swipe to navigate
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Case Investigation Modal */}
      <CaseInvestigationModal
        caseItem={investigatingCase}
        isOpen={!!investigatingCase}
        onClose={() => setInvestigatingCase(null)}
        onNavigateWorkbench={onNavigateWorkbench}
        onNavigateResponse={onNavigateResponse}
      />
    </section>
  );
};
