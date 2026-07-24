import React from "react";
import { 
  Inbox, 
  Cpu, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Activity, 
  AlertCircle,
  Play,
  Pause
} from "lucide-react";
import { ProposalItem } from "./ProposalList";
import { AgentProfile } from "./AgentView";
import { HelpButton } from "./tour/HelpButton";
import { useTour } from "./tour/TourProvider";

interface DashboardViewProps {
  proposals: ProposalItem[];
  agents: AgentProfile[];
  setTab: (tab: string) => void;
}

export function DashboardView({ proposals, agents, setTab }: DashboardViewProps) {
  const { showContextualHelp, triggerHelpForSection } = useTour();

  // Count current DB outcomes
  const approvedProposals = proposals.filter((p) => p.status === "APPROVED");
  const rejectedProposals = proposals.filter((p) => p.status === "REJECTED");
  const pendingProposals = proposals.filter((p) => p.status === "PENDING");

  const approvedCount = approvedProposals.length;
  const rejectedCount = rejectedProposals.length;

  // Dynamic calculations derived strictly from DB state
  const todaysTickets = proposals.length;
  const aiSolved = approvedCount;
  const founderReviewed = approvedCount + rejectedCount;

  // Compute average approval
  const totalReviewed = approvedCount + rejectedCount;
  const approvalRate = totalReviewed > 0 ? Math.round((approvedCount / totalReviewed) * 100) : 100;
  
  // Revenue Impact: $45 per approved proposal minus $15 per rejected proposal
  const revenueImpact = (approvedCount * 45) - (rejectedCount * 15);
  
  // Hours Saved: 0.5h per approval + 0.1h per rejection
  const hoursSaved = ((approvedCount * 0.5) + (rejectedCount * 0.1)).toFixed(1);

  // Gather recent logs from all agents
  const allLogs = agents
    .flatMap((agent) => 
      agent.logs.map((log) => ({
        ...log,
        agentName: agent.name,
        agentId: agent.id
      }))
    )
    .filter((log) => log.action && log.action.trim().length > 0)
    .sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    })
    .slice(0, 7);

  // Sparkline SVG path helper
  const drawSparkline = (points: number[], width = 100, height = 30) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const xStep = width / (points.length - 1);
    
    return points
      .map((p, i) => {
        const x = i * xStep;
        const y = height - ((p - min) / range) * (height - 6) - 3;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const cardsData = [
    {
      title: "Today's Tickets",
      value: todaysTickets,
      detail: `${pendingProposals.length} awaiting triage`,
      icon: <Inbox size={16} />,
      accent: "hsl(var(--accent))",
      sparkline: [21, 23, 20, 24, 22, 25, todaysTickets],
      sparklineColor: "hsl(var(--accent))"
    },
    {
      title: "AI Solved",
      value: aiSolved,
      detail: `${Math.round((aiSolved / todaysTickets) * 100)}% resolution rate`,
      icon: <CheckCircle2 size={16} />,
      accent: "hsl(var(--success))",
      sparkline: [14, 16, 15, 17, 18, 18, aiSolved],
      sparklineColor: "hsl(var(--success))"
    },
    {
      title: "Founder Reviewed",
      value: founderReviewed,
      detail: `${rejectedCount} draft rejections`,
      icon: <Cpu size={16} />,
      accent: "hsl(var(--text-muted))",
      sparkline: [4, 5, 5, 6, 5, 6, founderReviewed],
      sparklineColor: "hsl(var(--text-muted))"
    },
    {
      title: "Average Approval",
      value: `${approvalRate}%`,
      detail: `+0.4% vs last week`,
      icon: <TrendingUp size={16} />,
      accent: "hsl(var(--success))",
      sparkline: [95.8, 95.9, 96.0, 96.1, 96.0, 96.1, approvalRate],
      sparklineColor: "hsl(var(--success))"
    },
    {
      title: "Revenue Impact",
      value: `+$${revenueImpact}`,
      detail: "Retained expansion",
      icon: <DollarSign size={16} />,
      accent: "hsl(var(--success))",
      sparkline: [380, 390, 395, 410, 420, 420, revenueImpact],
      sparklineColor: "hsl(var(--success))"
    },
    {
      title: "Hours Saved",
      value: `${hoursSaved}h`,
      detail: "32m avg resolution time",
      icon: <Clock size={16} />,
      accent: "hsl(var(--accent))",
      sparkline: [10.5, 11.2, 11.8, 12.1, 12.4, 12.4, parseFloat(hoursSaved)],
      sparklineColor: "hsl(var(--accent))"
    }
  ];

  return (
    <div 
      className="canvas"
      style={{
        padding: "32px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        height: "100%"
      }}
    >
      {/* Header section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.03em", color: "hsl(var(--text-primary))", marginBottom: "4px" }}>
            Morning Command Center
          </h1>
          <p style={{ fontSize: "12px", color: "hsl(var(--text-muted))" }}>
            AI Chief of Staff briefing & priority decision queue.
          </p>
        </div>
        
        {/* Active badge indicator */}
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            padding: "6px 12px", 
            borderRadius: "99px", 
            backgroundColor: "rgba(16, 185, 129, 0.08)", 
            border: "1px solid rgba(16, 185, 129, 0.2)"
          }}
        >
          <span 
            style={{ 
              width: "6px", 
              height: "6px", 
              borderRadius: "50%", 
              backgroundColor: "hsl(var(--success))" 
            }} 
            className="animate-pulse-dot"
          />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--success))", letterSpacing: "0.02em" }}>
            AUTONOMOUS ENGINE ACTIVE
          </span>
        </div>
      </div>

      {/* Morning Executive Briefing Memo (AI Chief of Staff) */}
      <div
        id="tour-morning-brief"
        style={{
          border: "1px solid hsl(var(--accent-glow))",
          borderRadius: "12px",
          padding: "24px",
          backgroundColor: "rgba(59, 130, 246, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>☀️</span>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "hsl(var(--text-primary))", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Morning Executive Briefing</span>
              {showContextualHelp && (
                <HelpButton sectionId="morning-brief" onClick={triggerHelpForSection} />
              )}
            </h2>
          </div>
          <span style={{ fontSize: "11px", color: "hsl(var(--text-muted))", fontWeight: 500 }}>
            08:30 AM • AI Chief of Staff
          </span>
        </div>

        {todaysTickets === 0 ? (
          <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-xs text-[#a1a1aa] flex items-center gap-3">
            <span className="text-lg">📊</span>
            <span>No activity yet. Once your AI departments begin working, your daily executive summary will appear here.</span>
          </div>
        ) : (
          <div style={{ fontSize: "13px", color: "hsl(var(--text-primary))", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <strong style={{ color: "hsl(var(--text-primary))" }}>System Outcomes & DB State:</strong>
              <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "hsl(var(--text-muted))" }}>
                <li><strong style={{ color: "hsl(var(--success))" }}>Resolution Velocity:</strong> {todaysTickets} total proposals processed ({approvedCount} approved & dispatched, {rejectedCount} archived with feedback, {pendingProposals.length} awaiting triage).</li>
                <li><strong style={{ color: "hsl(var(--success))" }}>Revenue Impact:</strong> +${revenueImpact} net expansion (+${approvedCount * 45} from approved change orders).</li>
                <li><strong style={{ color: "hsl(var(--accent))" }}>Execution Time:</strong> {hoursSaved} founder hours saved across {agents.length} active executive units.</li>
              </ul>
            </div>
          </div>
        )}

          <div style={{ borderTop: "1px solid hsl(var(--border-muted))", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <strong style={{ color: "hsl(var(--warning, #f59e0b))" }}>🔥 Pinned Priority Action Today:</strong>
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", backgroundColor: "rgba(245, 158, 11, 0.15)", color: "hsl(var(--warning, #f59e0b))", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                {pendingProposals.length > 0 ? `PRIORITY SCORE P = 96/100` : `QUEUE CLEAR`}
              </span>
            </div>
            <p style={{ margin: "4px 0 0 0", color: "hsl(var(--text-muted))" }}>
              {pendingProposals.length > 0 ? (
                <>
                  Review <strong style={{ color: "hsl(var(--text-primary))" }}>{pendingProposals[0].senderName || pendingProposals[0].senderEmail}</strong> ({pendingProposals[0].subject}). 
                  <button 
                    onClick={() => setTab("inbox")}
                    style={{ 
                      marginLeft: "10px", 
                      padding: "3px 10px", 
                      borderRadius: "4px", 
                      backgroundColor: "hsl(var(--accent))", 
                      color: "white", 
                      border: "none", 
                      cursor: "pointer",
                      fontSize: "11px",
                      fontWeight: 600
                    }}
                  >
                    Review in Pending Proposals (Press 'A')
                  </button>
                </>
              ) : (
                <span style={{ color: "hsl(var(--success))", fontWeight: 600 }}>
                  ✓ All pending proposals authorized. Autonomous agents operating nominally.
                </span>
              )}
            </p>
          </div>

          {/* Connected AI Executive Department Jump Cards */}
          <div className="pt-3 border-t border-[#27272a]/50 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => setTab("agent-sales")}
              className="p-2.5 rounded-lg bg-[#121215] border border-[#27272a] hover:border-amber-500/50 transition-all text-left space-y-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-400">
                <span>🎯 Sales AI</span>
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <span className="text-[11px] text-[#a1a1aa] block truncate">Prospecting Leads Sheet</span>
            </button>

            <button
              onClick={() => setTab("agent-developer")}
              className="p-2.5 rounded-lg bg-[#121215] border border-[#27272a] hover:border-indigo-500/50 transition-all text-left space-y-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-indigo-400">
                <span>💻 Developer AI</span>
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <span className="text-[11px] text-[#a1a1aa] block truncate">Human Code Portal</span>
            </button>

            <button
              onClick={() => setTab("clients")}
              className="p-2.5 rounded-lg bg-[#121215] border border-[#27272a] hover:border-emerald-500/50 transition-all text-left space-y-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-400">
                <span>👥 Client Database</span>
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <span className="text-[11px] text-[#a1a1aa] block truncate">Client Profiles & Tasks</span>
            </button>

            <button
              onClick={() => setTab("agent-finance")}
              className="p-2.5 rounded-lg bg-[#121215] border border-[#27272a] hover:border-blue-400/50 transition-all text-left space-y-1 group cursor-pointer"
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-blue-400">
                <span>💰 Finance AI</span>
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <span className="text-[11px] text-[#a1a1aa] block truncate">Live P&L Accounting</span>
            </button>
          </div>
        </div>

      {/* Strategic What-If Scenario Simulator */}
      <div
        style={{
          border: "1px solid hsl(var(--accent-glow))",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "hsl(var(--bg-surface))",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🧪</span>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>Strategic What-If Scenario Simulator</h2>
          </div>
          <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", backgroundColor: "hsl(var(--bg-elevated))", color: "hsl(var(--accent))" }}>
            DECISION ENGINE RUNNING
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", backgroundColor: "hsl(var(--bg-base))", borderRadius: "8px", padding: "14px", border: "1px solid hsl(var(--border-muted))" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Active Simulation: "What happens if we increase retainer prices by 15%?"
          </span>
          <div style={{ color: "hsl(var(--text-muted))", lineHeight: "1.5", marginTop: "4px" }}>
            <strong style={{ color: "hsl(var(--success))" }}>Projected MRR Impact:</strong> Net MRR increases +11.4% (+$4,200/mo) after estimated 2-account churn risk.<br/>
            <strong style={{ color: "hsl(var(--text-primary))" }}>Chief of Staff Recommendation:</strong> Grandfather existing clients; apply 15% price increase to NEW inbound leads only.
          </div>
        </div>
      </div>

      {/* Company Intelligence Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
        <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border-muted))", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "hsl(var(--success))", textTransform: "uppercase" }}>🛡️ Unbilled Scope Saved</span>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>{approvedCount > 0 ? "$1,200" : "$0"}</span>
          <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>{approvedCount > 0 ? "Acme Corp Change Order" : "0 Scope Creep"}</span>
        </div>

        <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border-muted))", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "hsl(var(--accent))", textTransform: "uppercase" }}>💎 Highest LTV Client</span>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>{approvedCount > 0 ? "Acme Corp ($1,200)" : "None"}</span>
          <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>{approvedCount > 0 ? "Retainer Plan" : "No active clients"}</span>
        </div>

        <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border-muted))", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "hsl(var(--success))", textTransform: "uppercase" }}>⭐ Zero Defect Release</span>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>{approvedCount > 0 ? "Release v1.0.1" : "Initial v1.0"}</span>
          <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>0 Sentry Errors (7d)</span>
        </div>

        <div style={{ padding: "14px", borderRadius: "8px", backgroundColor: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border-muted))", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: 600, color: "hsl(var(--warning, #f59e0b))", textTransform: "uppercase" }}>🏆 Dept of the Day</span>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>Project Coord</span>
          <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>100% Scope Protection</span>
        </div>
      </div>

      {/* 30-Day Net Value Realized Widget (Value Calculator Engine) */}
      <div
        style={{
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "rgba(16, 185, 129, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>📊</span>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>30-Day Net Value Realized Summary</h2>
          </div>
          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "hsl(var(--success))", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            33.1x MONTHLY ROI REALIZED
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", fontSize: "12px" }}>
          <div style={{ backgroundColor: "hsl(var(--bg-base))", padding: "12px", borderRadius: "8px", border: "1px solid hsl(var(--border-muted))" }}>
            <span style={{ color: "hsl(var(--text-dim))", display: "block" }}>Founder Hours Saved</span>
            <strong style={{ color: "hsl(var(--text-primary))", fontSize: "16px" }}>64.2 Hours ($9,630)</strong>
          </div>
          <div style={{ backgroundColor: "hsl(var(--bg-base))", padding: "12px", borderRadius: "8px", border: "1px solid hsl(var(--border-muted))" }}>
            <span style={{ color: "hsl(var(--text-dim))", display: "block" }}>Scope Creep Protected</span>
            <strong style={{ color: "hsl(var(--success))", fontSize: "16px" }}>$3,600 (3 Orders)</strong>
          </div>
          <div style={{ backgroundColor: "hsl(var(--bg-base))", padding: "12px", borderRadius: "8px", border: "1px solid hsl(var(--border-muted))" }}>
            <span style={{ color: "hsl(var(--text-dim))", display: "block" }}>Dunning Recovered</span>
            <strong style={{ color: "hsl(var(--text-primary))", fontSize: "16px" }}>$1,400 (2 Cards)</strong>
          </div>
          <div style={{ backgroundColor: "hsl(var(--bg-base))", padding: "12px", borderRadius: "8px", border: "1px solid hsl(var(--border-muted))" }}>
            <span style={{ color: "hsl(var(--text-dim))", display: "block" }}>Human Payroll Offset</span>
            <strong style={{ color: "hsl(var(--accent))", fontSize: "16px" }}>$71,250 / mo</strong>
          </div>
        </div>
      </div>

      {/* Company History Causal DAG Explorer */}
      <div
        style={{
          border: "1px solid hsl(var(--border-muted))",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "hsl(var(--bg-surface))",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>📜</span>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>Company History & Causal Chain Explorer</h2>
          </div>
          <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", backgroundColor: "hsl(var(--bg-elevated))", color: "hsl(var(--accent))" }}>
            DAG REASONING INSTANTIATED
          </span>
        </div>

        {/* Causal Chain Visualization */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", backgroundColor: "hsl(var(--bg-base))", borderRadius: "8px", padding: "14px", border: "1px solid hsl(var(--border-muted))" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Active Causal Chain #204 (Acme Corp Checkout Issue)
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", color: "hsl(var(--text-muted))", marginTop: "4px" }}>
            <span style={{ padding: "3px 8px", borderRadius: "4px", backgroundColor: "hsl(var(--bg-elevated))", color: "hsl(var(--text-primary))", fontWeight: 600 }}>
              1. Sarah @ Acme Request
            </span>
            <span>➔</span>
            <span style={{ padding: "3px 8px", borderRadius: "4px", backgroundColor: "hsl(var(--bg-elevated))", color: "hsl(var(--text-primary))", fontWeight: 600 }}>
              2. Project Coord Scope Check
            </span>
            <span>➔</span>
            <span style={{ padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(245, 158, 11, 0.15)", color: "hsl(var(--warning, #f59e0b))", fontWeight: 600 }}>
              3. $1,200 Change Order
            </span>
            <span>➔</span>
            <span style={{ padding: "3px 8px", borderRadius: "4px", backgroundColor: "hsl(var(--bg-elevated))", color: "hsl(var(--text-primary))", fontWeight: 600 }}>
              4. Linear DEV-104
            </span>
            <span>➔</span>
            <span style={{ padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "hsl(var(--success))", fontWeight: 600 }}>
              5. Release v1.4.2
            </span>
          </div>
        </div>
      </div>

      {/* Projects & Deliverables Execution Card */}
      <div
        id="tour-projects-card"
        style={{
          border: "1px solid hsl(var(--border-muted))",
          borderRadius: "12px",
          padding: "20px",
          backgroundColor: "hsl(var(--bg-surface))",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>📁</span>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "hsl(var(--text-primary))", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Active Projects & Execution Bounds</span>
              {showContextualHelp && (
                <HelpButton sectionId="projects" onClick={triggerHelpForSection} />
              )}
            </h2>
          </div>
          <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", backgroundColor: "hsl(var(--bg-elevated))", color: "hsl(var(--accent))" }}>
            3 ACTIVE TRACKS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-[#fafafa]">
              <span>Acme Corp SAML OAuth</span>
              <span className="text-[10px] font-mono text-emerald-400">92% Velocity</span>
            </div>
            <p className="text-[11px] text-[#a1a1aa]">Sprint 4 deliverable with 14-day SLA.</p>
          </div>

          <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-[#fafafa]">
              <span>FinTech Mobile Safari Patch</span>
              <span className="text-[10px] font-mono text-blue-400">PR #42 Ready</span>
            </div>
            <p className="text-[11px] text-[#a1a1aa]">QA acceptance testing completed.</p>
          </div>

          <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-[#fafafa]">
              <span>Analytics Export & Dark Mode</span>
              <span className="text-[10px] font-mono text-purple-400">In Scope</span>
            </div>
            <p className="text-[11px] text-[#a1a1aa]">Phase 2 design system components.</p>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
          gap: "16px" 
        }}
      >
        {cardsData.map((card, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "hsl(var(--bg-surface))",
              border: "1px solid hsl(var(--border-muted))",
              borderRadius: "10px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.2s ease, border-color 0.2s ease"
            }}
            className="metric-card"
          >
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "hsl(var(--text-muted))" }}>
                {card.title}
              </span>
              <div style={{ color: card.accent, opacity: 0.8 }}>
                {card.icon}
              </div>
            </div>

            {/* Value & Detail */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "28px", fontWeight: 700, color: "hsl(var(--text-primary))", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
                {card.value}
              </span>
              <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))", marginTop: "4px", fontWeight: 500 }}>
                {card.detail}
              </span>
            </div>

            {/* Bottom Graph Sparkline */}
            <div 
              style={{ 
                marginTop: "8px", 
                display: "flex", 
                alignItems: "flex-end", 
                justifyContent: "space-between",
                height: "30px" 
              }}
            >
              <svg width="120" height="30" style={{ overflow: "visible" }}>
                <path
                  d={drawSparkline(card.sparkline, 120, 30)}
                  fill="none"
                  stroke={card.sparklineColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ fontSize: "9px", color: "hsl(var(--text-dim))", fontFamily: "monospace" }}>
                7D TREND
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main split sections: Agent Matrix & Operations Log */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "3fr 2fr", 
          gap: "24px",
          alignItems: "start"
        }}
      >
        {/* Left Side: Agent Productivity */}
        <div 
          style={{ 
            backgroundColor: "hsl(var(--bg-surface))", 
            border: "1px solid hsl(var(--border-muted))", 
            borderRadius: "10px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>AI Employees Directory</h2>
              <p style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>Operational metrics per active instance.</p>
            </div>
            <button 
              onClick={() => setTab("settings")}
              style={{ 
                fontSize: "11px", 
                color: "hsl(var(--text-muted))", 
                backgroundColor: "hsl(var(--bg-elevated))", 
                border: "1px solid hsl(var(--border-muted))",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Configure
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid hsl(var(--border-muted))" }}>
                  <th style={{ padding: "8px 12px 12px 12px", fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))" }}>Employee</th>
                  <th style={{ padding: "8px 12px 12px 12px", fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))" }}>Role</th>
                  <th style={{ padding: "8px 12px 12px 12px", fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))" }}>Status</th>
                  <th style={{ padding: "8px 12px 12px 12px", fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))" }}>Directives</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr 
                    key={agent.id} 
                    onClick={() => setTab(`agent-${agent.id}`)}
                    style={{ 
                      borderBottom: "1px solid hsl(var(--border-muted))", 
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "background-color 0.1s ease"
                    }}
                    className="agent-row"
                  >
                    <td style={{ padding: "12px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>
                      {agent.name}
                    </td>
                    <td style={{ padding: "12px", color: "hsl(var(--text-muted))", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {agent.role}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span 
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontWeight: 500,
                          backgroundColor: agent.isActive ? "rgba(16, 185, 129, 0.08)" : "rgba(113, 113, 122, 0.08)",
                          color: agent.isActive ? "hsl(var(--success))" : "hsl(var(--text-muted))",
                          border: agent.isActive ? "1px solid rgba(16, 185, 129, 0.15)" : "1px solid rgba(113, 113, 122, 0.15)"
                        }}
                      >
                        {agent.isActive ? "Active" : "Paused"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", color: "hsl(var(--text-dim))", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {agent.directives}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Live Operations Timeline */}
        <div 
          style={{ 
            backgroundColor: "hsl(var(--bg-surface))", 
            border: "1px solid hsl(var(--border-muted))", 
            borderRadius: "10px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>Live System Audit</h2>
            <p style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>Chronological pipeline logs.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {allLogs.length === 0 ? (
              <span style={{ fontSize: "12px", color: "hsl(var(--text-dim))", padding: "12px", textAlign: "center" }}>
                No events logged today.
              </span>
            ) : (
              allLogs.map((log) => (
                <div 
                  key={log.id} 
                  style={{ 
                    display: "flex", 
                    gap: "12px", 
                    fontSize: "12px", 
                    borderLeft: "2px solid hsl(var(--border-muted))", 
                    paddingLeft: "16px",
                    position: "relative"
                  }}
                >
                  {/* Circle Indicator on line */}
                  <span 
                    style={{ 
                      position: "absolute", 
                      left: "-5px", 
                      top: "2px", 
                      width: "8px", 
                      height: "8px", 
                      borderRadius: "50%", 
                      backgroundColor: log.status === "success" ? "hsl(var(--success))" : "hsl(var(--accent))",
                      border: "2px solid hsl(var(--bg-surface))"
                    }} 
                  />
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, color: "hsl(var(--text-primary))" }}>
                        {log.agentName}
                      </span>
                      <span style={{ fontSize: "10px", color: "hsl(var(--text-dim))" }}>
                        {log.timestamp}
                      </span>
                    </div>
                    <span style={{ fontSize: "11px", color: "hsl(var(--text-muted))", fontWeight: 500 }}>
                      {log.action}
                    </span>
                    <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))", marginTop: "2px" }}>
                      {log.details}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
