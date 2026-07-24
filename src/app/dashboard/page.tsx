"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ProposalList, ProposalItem } from "@/components/ProposalList";
import { WorkArea } from "@/components/WorkArea";
import { MockTriggers } from "@/components/MockTriggers";
import { BrainView } from "@/components/BrainView";
import { CommandBar } from "@/components/CommandBar";
import { RejectionPanel } from "@/components/RejectionPanel";
import { AgentView, AgentProfile } from "@/components/AgentView";
import { useKeyboard } from "@/hooks/useKeyboard";
import { DashboardView } from "@/components/DashboardView";
import { MeetingRoom } from "@/components/MeetingRoom";
import { ClientsView } from "@/components/ClientsView";
import {
  getProposals,
  getAgents,
  updateProposalDraft,
  approveProposal,
  rejectProposal,
  toggleAgentActive,
  saveAgentDirectives,
  runAgentAutonomousTask,
  triggerMockProposal,
  createProductionWorkspace,
  createDemoWorkspace
} from "@/app/actions";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { TourProvider, useTour } from "@/components/tour/TourProvider";

export default function DashboardPage() {
  const [tab, setTab] = useState<string>("dashboard");
  const [proposals, setProposals] = useState<ProposalItem[]>([]);
  const pendingProposals = proposals.filter((p) => p.status === "PENDING");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cmdKOpen, setCmdKOpen] = useState(false);
  const [rejectionId, setRejectionId] = useState<string | null>(null);

  // Workspace Mode State
  const [isDemo, setIsDemo] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  // App Data & Settings State
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState(
    "# clownfounder Company Guidelines\n\n## 1. Refund Policy\nWe process refunds for duplicate charges within 14 days of the transaction.\n\n## 2. Retainer Rules\nBug fixes are IN SCOPE. Custom redesigns generate $1,200 Change Orders."
  );
  const [stripeKey, setStripeKey] = useState("");
  const [resendKey, setResendKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  // Theme mode state ("dark" | "light" | "system")
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "system">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("clownfounder_theme") as "dark" | "light" | "system";
    if (saved) {
      setThemeMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("clownfounder_theme", themeMode);
    if (themeMode === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else if (themeMode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      document.documentElement.setAttribute("data-theme", prefersLight ? "light" : "dark");
    }
  }, [themeMode]);

  useEffect(() => {
    try {
      const gKey = localStorage.getItem("clownfounder_gemini_key") || "";
      const sKey = localStorage.getItem("clownfounder_stripe_key") || "";
      const rKey = localStorage.getItem("clownfounder_resend_key") || "";
      if (gKey) setGeminiKey(gKey);
      if (sKey) setStripeKey(sKey);
      if (rKey) setResendKey(rKey);
    } catch (err) {
      console.error("Failed loading saved keys:", err);
    }
  }, []);

  const handleUpdateGeminiKey = (key: string) => {
    setGeminiKey(key);
    try {
      localStorage.setItem("clownfounder_gemini_key", key);
    } catch (e) {}
  };

  const handleUpdateStripeKey = (key: string) => {
    setStripeKey(key);
    try {
      localStorage.setItem("clownfounder_stripe_key", key);
    } catch (e) {}
  };

  const handleUpdateResendKey = (key: string) => {
    setResendKey(key);
    try {
      localStorage.setItem("clownfounder_resend_key", key);
    } catch (e) {}
  };

  // Check URL parameters & local mode for Demo vs Production Onboarding
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");

    if (modeParam === "demo" || localStorage.getItem("clownfounder_mode") === "demo") {
      setIsDemo(true);
      setOnboardingCompleted(true);
      refreshData(true);
    } else {
      const isCompleted = localStorage.getItem("clownfounder_onboarding_completed") === "true";
      setOnboardingCompleted(isCompleted);
      refreshData(false);
    }
  }, []);

  // Synchronize SQLite data on load
  const refreshData = async (demoMode: boolean = false) => {
    try {
      const pList = await getProposals(demoMode);
      const aList = await getAgents();
      
      setProposals(
        pList.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          stripePlan: p.id === "proposal-2" ? "Premium Enterprise ($299/mo)" : "Team Subscriber ($99/mo)",
          stripeLTV: p.id === "proposal-1" ? 148 : p.id === "proposal-2" ? 1800 : 590
        }))
      );
      setAgents(
        aList.map((a) => ({
          ...a,
          logs: a.logs.map((l) => ({
            ...l,
            status: l.status as "success" | "running" | "paused"
          }))
        }))
      );
    } catch (err) {
      console.error("Failed loading SQLite database values:", err);
    }
  };

  const handleOnboardingComplete = async (setupData: any) => {
    try {
      await createProductionWorkspace(setupData);
      if (setupData.brainContent) {
        setKnowledgeBase(setupData.brainContent);
      }
      localStorage.setItem("clownfounder_onboarding_completed", "true");
      localStorage.removeItem("clownfounder_mode");
      setOnboardingCompleted(true);
      setIsDemo(false);
      refreshData(false);
    } catch (err) {
      console.error("Error creating production workspace:", err);
      localStorage.setItem("clownfounder_onboarding_completed", "true");
      setOnboardingCompleted(true);
      refreshData(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    const target = agents.find((a) => a.id === id);
    if (!target) return;
    try {
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
      );
      await toggleAgentActive(id, !target.isActive);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveDirectives = async (id: string, text: string) => {
    try {
      await saveAgentDirectives(id, text);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunAgentTask = async (id: string, customInstruction?: string) => {
    try {
      await runAgentAutonomousTask(id, customInstruction);
      await refreshData();
    } catch (err) {
      console.error("Failed running agent task:", err);
    }
  };

  // Auto-select first item if selection becomes invalid
  useEffect(() => {
    if (pendingProposals.length > 0 && (!selectedId || !pendingProposals.find(p => p.id === selectedId))) {
      setSelectedId(pendingProposals[0].id);
    } else if (pendingProposals.length === 0) {
      setSelectedId(null);
    }
  }, [proposals, selectedId]);

  // Navigate selection triggers
  const handleNext = () => {
    if (pendingProposals.length === 0 || tab !== "inbox") return;
    const currentIndex = pendingProposals.findIndex((p) => p.id === selectedId);
    if (currentIndex < pendingProposals.length - 1) {
      setSelectedId(pendingProposals[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (pendingProposals.length === 0 || tab !== "inbox") return;
    const currentIndex = pendingProposals.findIndex((p) => p.id === selectedId);
    if (currentIndex > 0) {
      setSelectedId(pendingProposals[currentIndex - 1].id);
    }
  };

  // Process proposal triages with spring animation slides
  const dismissProposal = async (id: string, nextStatus: "APPROVED" | "REJECTED", feedback?: string) => {
    setDismissingId(id);
    
    setTimeout(async () => {
      try {
        if (nextStatus === "APPROVED") {
          await approveProposal(id);
        } else {
          await rejectProposal(id, feedback || "Archived by user");
        }
        await refreshData();
      } catch (err) {
        console.error(err);
      } finally {
        setDismissingId(null);
      }
    }, 250);
  };

  const handleApprove = () => {
    if (!selectedId || tab !== "inbox") return;
    dismissProposal(selectedId, "APPROVED");
  };

  const handleReject = () => {
    if (!selectedId || tab !== "inbox") return;
    setRejectionId(selectedId);
  };

  const handleConfirmRejection = (feedback: string) => {
    if (!rejectionId) return;
    dismissProposal(rejectionId, "REJECTED", feedback);
    setRejectionId(null);
  };

  // Keyboard shortcut listener
  useKeyboard({
    onApprove: handleApprove,
    onReject: handleReject,
    onNext: handleNext,
    onPrev: handlePrev,
    isEditing,
    onFocusEditor: () => {
      if (tab === "inbox" && selectedId) {
        setIsEditing(true);
        setTimeout(() => editorRef.current?.focus(), 50);
      }
    },
    onCloseSettings: () => setCmdKOpen(false),
    onToggleCmdK: () => setCmdKOpen((prev) => !prev)
  });

  const updateDraft = async (text: string) => {
    if (!selectedId) return;
    try {
      await updateProposalDraft(selectedId, text);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Mock triggers settings handler
  const handleTriggerMock = async (template: string) => {
    try {
      const created = await triggerMockProposal(template);
      await refreshData();
      setSelectedId(created.id);
    } catch (err) {
      console.error("Failed triggering mock webhook item:", err);
    }
  };

  const selectedProposal = proposals.find((p) => p.id === selectedId) || null;
  const activeAgent = (tab && typeof tab === "string" && (tab.startsWith("agent-") || tab.startsWith("agent_")))
    ? agents.find((a) => a.id === tab.replace("agent-", "").replace("agent_", ""))
    : null;

  if (onboardingCompleted === false) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <TourProvider setTab={setTab} currentTab={tab}>
      <TourAutoStarter autoStart={onboardingCompleted === true} />
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#09090b]">
        {/* Demo Workspace Banner */}
        {isDemo && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-300 font-mono flex items-center justify-between z-40 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>🧪 DEMO WORKSPACE ACTIVE — Exploring Sample Company Data</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("clownfounder_mode");
                localStorage.removeItem("clownfounder_onboarding_completed");
                window.location.href = "/dashboard";
              }}
              className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-[11px] hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Exit Demo & Build Real Company →
            </button>
          </div>
        )}

        <div className="app-container flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <Sidebar
            currentTab={tab}
            setTab={setTab}
            pendingCount={pendingProposals.length}
            agents={agents}
          />

          {/* Dashboard View */}
          {tab === "dashboard" && (
            <DashboardView
              proposals={proposals}
              agents={agents}
              setTab={setTab}
            />
          )}

          {/* Main workspace splits */}
          {tab === "inbox" && (
            <>
              <ProposalList
                proposals={pendingProposals}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                dismissingId={dismissingId}
              />
              <WorkArea
                proposal={selectedProposal}
                onApprove={handleApprove}
                onReject={handleReject}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                updateDraft={updateDraft}
                editorRef={editorRef}
              />
            </>
          )}

          {tab === "clients" && (
            <ClientsView setTab={setTab} />
          )}

          {tab === "brain" && (
            <BrainView
              knowledgeBase={knowledgeBase}
              setKnowledgeBase={setKnowledgeBase}
            />
          )}

          {(tab === "meeting" || tab === "meetings") && (
            <MeetingRoom agents={agents} />
          )}

          {tab === "settings" && (
            <MockTriggers
              onTriggerMock={handleTriggerMock}
              geminiKey={geminiKey}
              setGeminiKey={handleUpdateGeminiKey}
              stripeKey={stripeKey}
              setStripeKey={handleUpdateStripeKey}
              resendKey={resendKey}
              setResendKey={handleUpdateResendKey}
              themeMode={themeMode}
              setThemeMode={setThemeMode}
            />
          )}

          {tab && typeof tab === "string" && (tab.startsWith("agent-") || tab.startsWith("agent_")) && activeAgent && (
            <AgentView
              agent={activeAgent}
              onToggleActive={handleToggleActive}
              onSaveDirectives={handleSaveDirectives}
              onRunTask={handleRunAgentTask}
            />
          )}

          {/* Command Menu Overlay */}
          <CommandBar
            isOpen={cmdKOpen}
            onClose={() => setCmdKOpen(false)}
            setTab={setTab}
            onTriggerMock={handleTriggerMock}
          />

          {/* Rejection Feedback Modal */}
          <RejectionPanel
            isOpen={rejectionId !== null}
            onClose={() => setRejectionId(null)}
            onSubmit={handleConfirmRejection}
            onSkip={() => handleConfirmRejection("Skipped explanation")}
          />
        </div>
      </div>
    </TourProvider>
  );
}

function TourAutoStarter({ autoStart }: { autoStart: boolean }) {
  const { startTour } = useTour();
  useEffect(() => {
    if (autoStart) {
      const tourDone = localStorage.getItem("clownfounder_tour_completed") === "true";
      if (!tourDone) {
        const timer = setTimeout(() => {
          startTour();
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [autoStart, startTour]);

  return null;
}

