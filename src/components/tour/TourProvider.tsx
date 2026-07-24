"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { TOUR_STEPS, TourStepConfig } from "./tourConfig";
import { SpotlightOverlay } from "./SpotlightOverlay";
import { Tooltip } from "./Tooltip";
import { updateTourSettings } from "@/app/actions";

interface TourContextType {
  isOpen: boolean;
  currentStepIndex: number;
  activeStep: TourStepConfig | null;
  showContextualHelp: boolean;
  activeHelpStep: TourStepConfig | null;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  dismissPermanently: () => void;
  toggleContextualHelp: (enabled: boolean) => void;
  triggerHelpForSection: (sectionId: string) => void;
}

const TourContext = createContext<TourContextType | null>(null);

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}

interface TourProviderProps {
  children: React.ReactNode;
  setTab: (tab: string) => void;
  currentTab: string;
}

export function TourProvider({ children, setTab, currentTab }: TourProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showContextualHelp, setShowContextualHelp] = useState(true);
  const [activeHelpStep, setActiveHelpStep] = useState<TourStepConfig | null>(null);

  // Load preferences from localStorage & sync on mount
  useEffect(() => {
    try {
      const tourDone = localStorage.getItem("clownfounder_tour_completed") === "true";
      const helpOpt = localStorage.getItem("clownfounder_show_contextual_help");
      if (helpOpt !== null) {
        setShowContextualHelp(helpOpt === "true");
      }
    } catch (e) {}
  }, []);

  const activeStep = isOpen && TOUR_STEPS[currentStepIndex] ? TOUR_STEPS[currentStepIndex] : null;

  // Auto switch tabs if active step requires a different tab
  useEffect(() => {
    if (activeStep && activeStep.requiredTab && activeStep.requiredTab !== currentTab) {
      setTab(activeStep.requiredTab);
    }
  }, [activeStep, currentTab, setTab]);

  const startTour = useCallback(() => {
    setCurrentStepIndex(0);
    setIsOpen(true);
    setActiveHelpStep(null);
    if (TOUR_STEPS[0] && TOUR_STEPS[0].requiredTab) {
      setTab(TOUR_STEPS[0].requiredTab);
    }
  }, [setTab]);

  const endTour = useCallback(() => {
    setIsOpen(false);
    setActiveHelpStep(null);
    try {
      localStorage.setItem("clownfounder_tour_completed", "true");
      updateTourSettings({ tourCompleted: true });
    } catch (e) {}
  }, []);

  const dismissPermanently = useCallback(() => {
    setIsOpen(false);
    setActiveHelpStep(null);
    try {
      localStorage.setItem("clownfounder_tour_completed", "true");
      updateTourSettings({ tourCompleted: true });
    } catch (e) {}
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (TOUR_STEPS[nextIdx] && TOUR_STEPS[nextIdx].requiredTab) {
        setTab(TOUR_STEPS[nextIdx].requiredTab);
      }
    } else {
      endTour();
    }
  }, [currentStepIndex, endTour, setTab]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      if (TOUR_STEPS[prevIdx] && TOUR_STEPS[prevIdx].requiredTab) {
        setTab(TOUR_STEPS[prevIdx].requiredTab);
      }
    }
  }, [currentStepIndex, setTab]);

  const toggleContextualHelp = useCallback((enabled: boolean) => {
    setShowContextualHelp(enabled);
    try {
      localStorage.setItem("clownfounder_show_contextual_help", enabled ? "true" : "false");
      updateTourSettings({ showContextualHelp: enabled });
    } catch (e) {}
  }, []);

  const triggerHelpForSection = useCallback((sectionId: string) => {
    const targetStep = TOUR_STEPS.find(
      (s) => s.id === sectionId || s.targetSelector.includes(sectionId)
    );
    if (targetStep) {
      setIsOpen(false);
      setActiveHelpStep(targetStep);
      if (targetStep.requiredTab && targetStep.requiredTab !== currentTab) {
        setTab(targetStep.requiredTab);
      }
    }
  }, [currentTab, setTab]);

  // Accessibility Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (isOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          endTour();
        } else if (e.key === "Enter" || e.key === "ArrowRight") {
          e.preventDefault();
          nextStep();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevStep();
        }
      } else if (activeHelpStep) {
        if (e.key === "Escape") {
          e.preventDefault();
          setActiveHelpStep(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeHelpStep, nextStep, prevStep, endTour]);

  return (
    <TourContext.Provider
      value={{
        isOpen,
        currentStepIndex,
        activeStep,
        showContextualHelp,
        activeHelpStep,
        startTour,
        endTour,
        nextStep,
        prevStep,
        dismissPermanently,
        toggleContextualHelp,
        triggerHelpForSection
      }}
    >
      {children}

      {/* Full Tour Overlay & Tooltip */}
      {isOpen && activeStep && (
        <>
          <SpotlightOverlay targetSelector={activeStep.targetSelector} isOpen={isOpen} />
          <Tooltip
            step={activeStep}
            stepIndex={currentStepIndex}
            totalSteps={TOUR_STEPS.length}
            isOpen={isOpen}
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={endTour}
            onDismissPermanently={dismissPermanently}
          />
        </>
      )}

      {/* Contextual Help Single Tooltip */}
      {activeHelpStep && !isOpen && (
        <>
          <SpotlightOverlay targetSelector={activeHelpStep.targetSelector} isOpen={true} />
          <Tooltip
            step={activeHelpStep}
            stepIndex={0}
            totalSteps={1}
            isOpen={true}
            onNext={() => setActiveHelpStep(null)}
            onPrev={() => setActiveHelpStep(null)}
            onSkip={() => setActiveHelpStep(null)}
            onDismissPermanently={() => setActiveHelpStep(null)}
          />
        </>
      )}
    </TourContext.Provider>
  );
}
