export interface TourStepConfig {
  id: string;
  title: string;
  badge: string;
  content: string;
  targetSelector: string;
  placement: "top" | "bottom" | "left" | "right";
  requiredTab: string;
  actionText?: string;
}

export const TOUR_STEPS: TourStepConfig[] = [
  {
    id: "welcome",
    title: "Welcome to clownfounder",
    badge: "EXECUTIVE OPERATING SYSTEM",
    content: "Your company now has an autonomous AI executive team working alongside you. Let's take 2 minutes to walk through your command center.",
    targetSelector: "#tour-logo-header",
    placement: "right",
    requiredTab: "dashboard"
  },
  {
    id: "morning-brief",
    title: "Morning Brief & Executive Summary",
    badge: "SIGNATURE FEATURE",
    content: "Start every day with quiet clarity. Your AI departments work overnight and synthesize progress, key metrics, and recommended actions into a calm daily briefing.",
    targetSelector: "#tour-morning-brief",
    placement: "bottom",
    requiredTab: "dashboard"
  },
  {
    id: "projects",
    title: "Projects & Execution",
    badge: "OPERATIONAL MILESTONES",
    content: "Track client deliverables, sprint velocity, and active project bounds. AI agents automatically update milestone progress as proposals get approved.",
    targetSelector: "#tour-projects-card",
    placement: "top",
    requiredTab: "dashboard"
  },
  {
    id: "inbox-feed",
    title: "Action Feed & Proposal Triage",
    badge: "FOUNDER DECISION LOOP",
    content: "No noisy chat threads. Inbound emails and client requests are analyzed by your AI team and presented as structured recommendations ready for your review.",
    targetSelector: "#tour-inbox-tab",
    placement: "right",
    requiredTab: "inbox"
  },
  {
    id: "work-area",
    title: "AI Drafts & Contract Verification",
    badge: "HUMAN-IN-THE-LOOP CONTROL",
    content: "Review AI-generated code fixes, scope checks, and email replies. You can edit any draft directly, inspect confidence scores, or approve with 1 click.",
    targetSelector: "#tour-work-area",
    placement: "left",
    requiredTab: "inbox"
  },
  {
    id: "company-brain",
    title: "Company Brain & Guidelines",
    badge: "SHARED ORGANIZATIONAL MEMORY",
    content: "Your AI team gets smarter as you store docs, pricing rules, retainer boundaries, and FAQs. They strictly follow these guidelines when triaging requests.",
    targetSelector: "#tour-brain-tab",
    placement: "right",
    requiredTab: "brain"
  },
  {
    id: "huddle-room",
    title: "Executive Huddles & Direct Sync",
    badge: "DEPARTMENT COLLABORATION",
    content: "Hold 1-on-1 strategy sessions or cross-department huddles with your AI leaders to refine directives or discuss complex initiatives.",
    targetSelector: "#tour-meetings-tab",
    placement: "right",
    requiredTab: "meeting"
  },
  {
    id: "agents-roster",
    title: "AI Department Heads",
    badge: "AUTONOMOUS AGENT ROSTER",
    content: "Manage Sales, Engineering, QA, DevOps, and Support agents. Pause or activate specific units, update directives, or launch custom autonomous tasks.",
    targetSelector: "#tour-agents-section",
    placement: "right",
    requiredTab: "dashboard"
  },
  {
    id: "settings-guidance",
    title: "Settings & Guidance Controls",
    badge: "SYSTEM CONFIGURATION",
    content: "Configure themes, API keys, and onboarding guidance. You can restart this tour anytime or toggle contextual (?) help icons for quick reference.",
    targetSelector: "#tour-settings-tab",
    placement: "right",
    requiredTab: "settings"
  }
];
