import React, { useState, useEffect } from "react";
import { UserCheck, Activity, Terminal, Shield, Play, Pause, FileCode, Send, MessageSquare, Zap, Loader2, BarChart2, TrendingUp, DollarSign, Share2, Layers, Search, Plus } from "lucide-react";
import { 
  getOrCreateDirectChat, 
  sendHuddleMessageAndGetResponse, 
  getExecutiveDashboardsData, 
  addSalesLead, 
  addMarketingPost, 
  addAnalyticsInsight, 
  addLegalAuditLog,
  addResearchNote,
  addChiefMemo,
  addProjectMilestone,
  addSupportFaq,
  addDeveloperCommit
} from "@/app/actions";

export interface LogEntry {
  id?: string;
  timestamp: string;
  action: string;
  details: string;
  status: "success" | "running" | "paused";
  createdAt?: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  isActive: boolean;
  logs: LogEntry[];
  directives: string;
}

interface AgentViewProps {
  agent: AgentProfile;
  onToggleActive: (id: string) => void;
  onSaveDirectives: (id: string, text: string) => void;
  onRunTask?: (id: string, customInstruction?: string) => Promise<void>;
}

export function AgentView({ agent, onToggleActive, onSaveDirectives, onRunTask }: AgentViewProps) {
  const [directives, setDirectives] = useState(agent.directives);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRunningTask, setIsRunningTask] = useState(false);
  const [customTaskInstruction, setCustomTaskInstruction] = useState("");

  // Chatbot & Dashboard State
  const [activeTab, setActiveTab] = useState<"logs" | "chat" | "dashboard">("dashboard");
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatSubmitting, setIsChatSubmitting] = useState(false);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [dashData, setDashData] = useState<any>(null);

  useEffect(() => {
    getExecutiveDashboardsData().then((res) => setDashData(res));
  }, []);

  // Sync state when agent changes or directives are updated
  useEffect(() => {
    setDirectives(agent.directives);
  }, [agent.id, agent.directives]);

  const loadChat = async () => {
    try {
      const chat = await getOrCreateDirectChat(agent.id);
      setMeetingId(chat.id);
      setMessages(chat.messages);
    } catch (err) {
      console.error("Failed loading direct chat:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "chat") {
      loadChat();
    }
  }, [agent.id, activeTab]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !meetingId || isChatSubmitting) return;

    const messageToSend = chatInput.trim();
    setChatInput("");
    setIsChatSubmitting(true);

    try {
      const updatedMessages = await sendHuddleMessageAndGetResponse(meetingId, messageToSend);
      setMessages(updatedMessages);
    } catch (err) {
      console.error("Failed sending direct message:", err);
    } finally {
      setIsChatSubmitting(false);
    }
  };

  const handleExecuteTask = async () => {
    if (!onRunTask || isRunningTask) return;
    setIsRunningTask(true);
    try {
      await onRunTask(agent.id, customTaskInstruction.trim() || undefined);
      setCustomTaskInstruction("");
      setToastMessage(`⚡ ${agent.name} executed autonomous task cycle`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error("Failed executing task:", err);
    } finally {
      setIsRunningTask(false);
    }
  };

  const handleSave = () => {
    onSaveDirectives(agent.id, directives);
    setToastMessage(`${agent.name} operational directives saved`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="canvas" style={{ padding: "40px", overflowY: "auto", display: "flex", gap: "24px" }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 100,
          backgroundColor: "#10b981",
          color: "#000000",
          padding: "10px 16px",
          borderRadius: "8px",
          fontWeight: 700,
          fontSize: "12px",
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)"
        }}>
          {toastMessage}
        </div>
      )}

      {/* Left Column: Profile & Logs */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "32px" }}>
        
        {/* Header Summary & Action Controls */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>{agent.name}</h1>
              <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "99px", backgroundColor: agent.isActive ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", color: agent.isActive ? "hsl(var(--success))" : "#ef4444", border: `1px solid ${agent.isActive ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}` }}>
                {agent.isActive ? "🟢 OPERATIONAL UNIT" : "🔴 PAUSED"}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "hsl(var(--accent))", fontWeight: 600 }}>{agent.role}</span>
            <p style={{ fontSize: "13px", color: "hsl(var(--text-muted))", marginTop: "4px" }}>{agent.description}</p>
          </div>

          {/* Execution & Active Status Control Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {onRunTask && (
              <button
                onClick={handleExecuteTask}
                disabled={isRunningTask}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 18px",
                  borderRadius: "6px",
                  backgroundColor: "hsl(var(--accent))",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: isRunningTask ? "wait" : "pointer",
                  border: "none",
                  boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)",
                  transition: "all 0.15s ease"
                }}
              >
                {isRunningTask ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                <span>{isRunningTask ? "Executing Work Loop..." : "Run Autonomous Task Now"}</span>
              </button>
            )}

            <button
              onClick={() => onToggleActive(agent.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 16px",
                borderRadius: "6px",
                backgroundColor: agent.isActive ? "hsl(var(--bg-elevated))" : "hsl(var(--text-primary))",
                color: agent.isActive ? "hsl(var(--text-primary))" : "hsl(var(--bg-base))",
                border: agent.isActive ? "1px solid hsl(var(--border-muted))" : "none",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {agent.isActive ? (
                <>
                  <Pause size={14} />
                  <span>Pause Agent</span>
                </>
              ) : (
                <>
                  <Play size={14} />
                  <span>Activate Agent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Custom Directive Trigger Bar */}
        {onRunTask && (
          <div style={{ display: "flex", gap: "8px", backgroundColor: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border-muted))", padding: "10px 14px", borderRadius: "8px" }}>
            <input
              type="text"
              placeholder={`Issue one-off instruction to ${agent.name} (e.g. 'Audit Stripe refund logs')...`}
              value={customTaskInstruction}
              onChange={(e) => setCustomTaskInstruction(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleExecuteTask(); }}
              disabled={isRunningTask}
              style={{
                flex: 1,
                backgroundColor: "hsl(var(--bg-base))",
                border: "1px solid hsl(var(--border-muted))",
                borderRadius: "6px",
                padding: "8px 12px",
                color: "hsl(var(--text-primary))",
                fontSize: "12px"
              }}
            />
            <button
              onClick={handleExecuteTask}
              disabled={isRunningTask || !customTaskInstruction.trim()}
              style={{
                backgroundColor: "hsl(var(--bg-elevated))",
                color: "hsl(var(--text-primary))",
                border: "1px solid hsl(var(--border-muted))",
                borderRadius: "6px",
                padding: "0 14px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Execute
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid hsl(var(--border-muted))", paddingBottom: "4px" }}>
          <button
            onClick={() => setActiveTab("dashboard")}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: "transparent",
              color: activeTab === "dashboard" ? "hsl(var(--text-primary))" : "hsl(var(--text-dim))",
              border: "none",
              borderBottom: activeTab === "dashboard" ? "2px solid hsl(var(--border-focus))" : "2px solid transparent",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <BarChart2 size={13} />
            <span>Department Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: "transparent",
              color: activeTab === "logs" ? "hsl(var(--text-primary))" : "hsl(var(--text-dim))",
              border: "none",
              borderBottom: activeTab === "logs" ? "2px solid hsl(var(--border-focus))" : "2px solid transparent",
              transition: "all 0.15s ease"
            }}
          >
            Execution Logs ({agent.logs.length})
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: "transparent",
              color: activeTab === "chat" ? "hsl(var(--text-primary))" : "hsl(var(--text-dim))",
              border: "none",
              borderBottom: activeTab === "chat" ? "2px solid hsl(var(--border-focus))" : "2px solid transparent",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <MessageSquare size={13} />
            <span>Direct Chatbot</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "dashboard" && (
          <div className="space-y-4 font-sans text-xs">
            
            {/* Sales AI Spreadsheet Lead Sheet */}
            {(agent.id.includes("sales") || agent.id.includes("commercial")) && dashData?.salesLeads && (
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search size={16} className="text-amber-400" />
                    <h3 className="font-bold text-[#fafafa] text-sm">Sales AI: Prospecting Lead Sheet</h3>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    Targeted from Company Brain Services
                  </span>
                </div>

                {/* Founder Manual Lead Creation Form */}
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex flex-wrap items-center gap-2">
                  <input type="text" id="manual-lead-company" placeholder="Company (e.g. Acme Corp)" className="px-2.5 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-amber-500" />
                  <input type="text" id="manual-lead-contact" placeholder="Contact Person" className="px-2.5 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-amber-500" />
                  <input type="email" id="manual-lead-email" placeholder="Email Address" className="px-2.5 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-amber-500" />
                  <input type="text" id="manual-lead-service" placeholder="Service (e.g. WordPress Integration)" className="px-2.5 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] flex-1 focus:outline-hidden focus:border-amber-500" />
                  <button
                    type="button"
                    onClick={async () => {
                      const companyEl = document.getElementById("manual-lead-company") as HTMLInputElement;
                      const contactEl = document.getElementById("manual-lead-contact") as HTMLInputElement;
                      const emailEl = document.getElementById("manual-lead-email") as HTMLInputElement;
                      const serviceEl = document.getElementById("manual-lead-service") as HTMLInputElement;
                      if (companyEl && contactEl && emailEl && companyEl.value.trim()) {
                        await addSalesLead({ company: companyEl.value, contact: contactEl.value, email: emailEl.value, service: serviceEl.value || "Custom Tech Service" });
                        companyEl.value = ""; contactEl.value = ""; emailEl.value = ""; serviceEl.value = "";
                        const res = await getExecutiveDashboardsData();
                        setDashData(res);
                      }
                    }}
                    className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>+ Add Lead</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto border border-[#27272a] rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#18181b] text-[11px] font-mono text-[#a1a1aa] border-b border-[#27272a]">
                        <th className="p-3">COMPANY</th>
                        <th className="p-3">CONTACT</th>
                        <th className="p-3">TARGET SERVICE</th>
                        <th className="p-3">FIT SCORE</th>
                        <th className="p-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a] text-[#fafafa]">
                      {dashData.salesLeads.map((lead: any) => (
                        <tr key={lead.id} className="hover:bg-[#18181b]/50">
                          <td className="p-3 font-semibold">{lead.company}</td>
                          <td className="p-3 text-[#a1a1aa]">{lead.contact} ({lead.email})</td>
                          <td className="p-3 text-indigo-400">{lead.service}</td>
                          <td className="p-3 font-mono text-emerald-400">{lead.fitScore}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {lead.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Marketing AI Daily Posts Queue */}
            {(agent.id.includes("marketing") || agent.id.includes("brand")) && dashData?.marketingPosts && (
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 size={16} className="text-indigo-400" />
                    <h3 className="font-bold text-[#fafafa] text-sm">Marketing AI: Daily Brand Post Queue</h3>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                    Auto-Scheduled
                  </span>
                </div>

                {/* Founder Manual Marketing Post Form */}
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center gap-2">
                  <input type="text" id="manual-post-content" placeholder="Founder manual brand post: e.g. Launching our custom WordPress AI integration service..." className="flex-1 px-3 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500" />
                  <button
                    type="button"
                    onClick={async () => {
                      const postEl = document.getElementById("manual-post-content") as HTMLInputElement;
                      if (postEl && postEl.value.trim()) {
                        await addMarketingPost({ platform: "LinkedIn / X", content: postEl.value.trim() });
                        postEl.value = "";
                        const res = await getExecutiveDashboardsData();
                        setDashData(res);
                      }
                    }}
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus size={13} />
                    <span>+ Create Post</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {dashData.marketingPosts.map((post: any) => (
                    <div key={post.id} className="p-4 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-indigo-400 font-bold">{post.platform}</span>
                        <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{post.status}</span>
                      </div>
                      <p className="text-xs text-[#fafafa] leading-relaxed">{post.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Finance AI P&L Breakdown */}
            {(agent.id.includes("finance") || agent.id.includes("revenue")) && dashData?.financeMetrics && (
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-emerald-400" />
                    <h3 className="font-bold text-[#fafafa] text-sm">Finance AI: Profit & Loss (P&L) Statement</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    Live SQLite Accounting
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                    <span className="text-[10px] font-mono text-[#71717a] block">MONTHLY ARR</span>
                    <span className="text-base font-bold text-[#fafafa]">{dashData.financeMetrics.monthlyARR}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                    <span className="text-[10px] font-mono text-[#71717a] block">EXPENSES</span>
                    <span className="text-base font-bold text-red-400">{dashData.financeMetrics.expenses}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                    <span className="text-[10px] font-mono text-[#71717a] block">NET PROFIT</span>
                    <span className="text-base font-bold text-emerald-400">{dashData.financeMetrics.netProfit}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]">
                    <span className="text-[10px] font-mono text-[#71717a] block">PROFIT MARGIN</span>
                    <span className="text-base font-bold text-indigo-400">{dashData.financeMetrics.profitMargin}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics AI Growth Points */}
            {(agent.id.includes("analytics") || agent.id.includes("growth")) && dashData?.analyticsInsights && (
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-400" />
                    <h3 className="font-bold text-[#fafafa] text-sm">Analytics AI: Company Growth Action Items</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {dashData.analyticsInsights.map((item: any, i: number) => (
                    <div key={i} className="p-4 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#fafafa] text-xs">{item.title}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{item.impact}</span>
                      </div>
                      <p className="text-xs text-[#a1a1aa]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HR AI Employee Performance Graphs */}
            {(agent.id.includes("hr") || agent.id.includes("people")) && dashData?.hrMetrics && (
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart2 size={16} className="text-indigo-400" />
                    <h3 className="font-bold text-[#fafafa] text-sm">HR AI: AI Employees Performance & Accuracy</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {dashData.hrMetrics.map((row: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium text-[#fafafa]">
                        <span>{row.agent}</span>
                        <span className="font-mono text-emerald-400">{row.accuracy} Accuracy</span>
                      </div>
                      <div className="w-full bg-[#09090b] h-2 rounded-full overflow-hidden border border-[#27272a]">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: row.accuracy }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legal AI Scope Audit Logs */}
            {(agent.id.includes("legal") || agent.id.includes("compliance")) && dashData?.legalAuditLogs && (
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-emerald-400" />
                    <h3 className="font-bold text-[#fafafa] text-sm">Legal AI: Service Scope & Company Brain Audit</h3>
                  </div>
                </div>

                <div className="space-y-2">
                  {dashData.legalAuditLogs.map((log: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-[#fafafa] block">{log.client}</span>
                        <span className="text-[11px] text-[#a1a1aa]">{log.request}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Developer AI: Human Developer Work Portal */}
            {(agent.id.includes("developer") || agent.id.includes("dev")) && (
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode size={16} className="text-indigo-400" />
                    <h3 className="font-bold text-[#fafafa] text-sm">Human Developer Work Portal</h3>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                    Human-In-The-Loop Engineering
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] space-y-2">
                  <span className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider block">Log Code Update & Pull Request (PR)</span>
                  <div className="flex items-center gap-2">
                    <input type="text" id="dev-commit-msg" placeholder="e.g. Completed WordPress theme setup, plugin config, & OAuth SSO..." className="flex-1 px-3 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500" />
                    <button
                      type="button"
                      onClick={async () => {
                        const el = document.getElementById("dev-commit-msg") as HTMLInputElement;
                        if (el && el.value.trim()) {
                          await addDeveloperCommit({ commitMsg: el.value.trim() });
                          el.value = "";
                          const res = await getExecutiveDashboardsData();
                          setDashData(res);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus size={13} />
                      <span>Log Code Commit & PR</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">Recent Developer Commits & PRs</h4>
                  {dashData?.developerCommits?.map((c: any) => (
                    <div key={c.id} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-[#fafafa] text-xs block">{c.commitMsg}</span>
                        <span className="text-[10px] font-mono text-indigo-400">{c.prNumber}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Research AI Dashboard */}
            {(agent.id.includes("research")) && (
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#fafafa] text-sm flex items-center gap-2">
                    <Search size={16} className="text-indigo-400" />
                    <span>Research AI: Tech & Market Benchmark Notes</span>
                  </h3>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center gap-2">
                  <input type="text" id="res-topic" placeholder="Research topic (e.g. WordPress 6.7 Security)..." className="flex-1 px-3 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa]" />
                  <button
                    type="button"
                    onClick={async () => {
                      const el = document.getElementById("res-topic") as HTMLInputElement;
                      if (el && el.value.trim()) {
                        await addResearchNote({ topic: el.value.trim(), impact: "High Tech Relevance", summary: "Researched technical benchmarks." });
                        el.value = "";
                        const res = await getExecutiveDashboardsData();
                        setDashData(res);
                      }
                    }}
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus size={13} />
                    <span>+ Add Research</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {dashData?.researchNotes?.map((r: any) => (
                    <div key={r.id} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
                      <div className="flex items-center justify-between font-semibold text-xs text-[#fafafa]">
                        <span>{r.topic}</span>
                        <span className="text-[10px] font-mono text-indigo-400">{r.impact}</span>
                      </div>
                      <p className="text-xs text-[#a1a1aa]">{r.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chief of Staff AI Dashboard */}
            {(agent.id.includes("chief") || agent.id.includes("coordinator")) && (
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#fafafa] text-sm flex items-center gap-2">
                    <UserCheck size={16} className="text-amber-400" />
                    <span>Chief of Staff: Executive Memos & Priorities</span>
                  </h3>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center gap-2">
                  <input type="text" id="memo-title" placeholder="Executive Memo Title..." className="flex-1 px-3 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa]" />
                  <button
                    type="button"
                    onClick={async () => {
                      const el = document.getElementById("memo-title") as HTMLInputElement;
                      if (el && el.value.trim()) {
                        await addChiefMemo({ title: el.value.trim() });
                        el.value = "";
                        const res = await getExecutiveDashboardsData();
                        setDashData(res);
                      }
                    }}
                    className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus size={13} />
                    <span>+ Add Memo</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {dashData?.chiefMemos?.map((m: any) => (
                    <div key={m.id} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between text-xs text-[#fafafa]">
                      <span>{m.title}</span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{m.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support AI FAQ Deflection Dashboard */}
            {(agent.id.includes("support") || agent.id.includes("csat")) && (
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#fafafa] text-sm flex items-center gap-2">
                    <MessageSquare size={16} className="text-emerald-400" />
                    <span>Support AI: Knowledge Base FAQ & Deflection Rules</span>
                  </h3>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] space-y-2">
                  <input type="text" id="faq-q" placeholder="FAQ Question (e.g. How to check project deliverables?)..." className="w-full px-3 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa]" />
                  <div className="flex items-center gap-2">
                    <input type="text" id="faq-a" placeholder="Deflection Answer..." className="flex-1 px-3 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa]" />
                    <button
                      type="button"
                      onClick={async () => {
                        const qEl = document.getElementById("faq-q") as HTMLInputElement;
                        const aEl = document.getElementById("faq-a") as HTMLInputElement;
                        if (qEl && aEl && qEl.value.trim()) {
                          await addSupportFaq({ question: qEl.value.trim(), answer: aEl.value.trim() });
                          qEl.value = ""; aEl.value = "";
                          const res = await getExecutiveDashboardsData();
                          setDashData(res);
                        }
                      }}
                      className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus size={13} />
                      <span>+ Add FAQ</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {dashData?.supportFaqs?.map((f: any) => (
                    <div key={f.id} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1 text-xs">
                      <span className="font-semibold text-emerald-400 block">Q: {f.question}</span>
                      <p className="text-[#a1a1aa]">A: {f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
        {activeTab === "logs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={16} style={{ color: "hsl(var(--text-muted))" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Work Execution Log
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {agent.logs.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "hsl(var(--text-dim))", border: "1px dashed hsl(var(--border-muted))", borderRadius: "8px" }}>
                  No recent activity logged for this agent. Click "Run Autonomous Task Now" to trigger a work cycle.
                </div>
              ) : (
                agent.logs.map((log, index) => (
                  <div
                    key={log.id || index}
                    style={{
                      backgroundColor: "hsl(var(--bg-surface))",
                      border: "1px solid hsl(var(--border-muted))",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>{log.action}</span>
                      <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>{log.timestamp}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "hsl(var(--text-muted))", lineHeight: "1.5" }}>{log.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, minHeight: "360px" }}>
            {/* Messages box */}
            <div 
              style={{ 
                flex: 1, 
                backgroundColor: "hsl(var(--bg-surface))", 
                border: "1px solid hsl(var(--border-muted))", 
                borderRadius: "8px", 
                padding: "20px", 
                display: "flex", 
                flexDirection: "column", 
                gap: "12px",
                maxHeight: "360px",
                overflowY: "auto"
              }}
            >
              {messages.map((msg) => {
                const isFounder = msg.senderId === "founder";
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      alignSelf: isFounder ? "flex-end" : "flex-start",
                      maxWidth: "80%"
                    }}
                  >
                    <div style={{ display: "flex", gap: "8px", fontSize: "10px", color: "hsl(var(--text-dim))", justifyContent: isFounder ? "flex-end" : "flex-start" }}>
                      <span style={{ fontWeight: 600, color: isFounder ? "hsl(var(--accent))" : "hsl(var(--text-primary))" }}>{msg.senderName}</span>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        lineHeight: "1.5",
                        backgroundColor: isFounder ? "hsl(var(--bg-elevated))" : "hsl(var(--bg-base))",
                        color: "hsl(var(--text-primary))",
                        border: "1px solid hsl(var(--border-muted))"
                      }}
                    >
                      {msg.bodyText}
                    </div>
                  </div>
                );
              })}
              
              {isChatSubmitting && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignSelf: "flex-start" }}>
                  <div style={{ fontSize: "10px", color: "hsl(var(--text-dim))" }}>
                    <span style={{ fontWeight: 600 }}>Sync Connection</span>
                  </div>
                  <div style={{ padding: "8px 12px", borderRadius: "6px", fontSize: "12px", color: "hsl(var(--text-muted))", backgroundColor: "hsl(var(--bg-base))", border: "1px solid hsl(var(--border-muted))" }}>
                    {agent.name} is compiling parameters...
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendChatMessage} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder={`Ask ${agent.name} questions or update directives...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isChatSubmitting}
                style={{
                  flex: 1,
                  backgroundColor: "hsl(var(--bg-surface))",
                  border: "1px solid hsl(var(--border-muted))",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  color: "hsl(var(--text-primary))",
                  fontSize: "12px"
                }}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatSubmitting}
                style={{
                  backgroundColor: "hsl(var(--text-primary))",
                  color: "hsl(var(--bg-base))",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0 16px",
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  opacity: (!chatInput.trim() || isChatSubmitting) ? 0.5 : 1
                }}
              >
                <Send size={12} />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Right Column: Prompts/Directives Editor */}
      <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "12px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileCode size={16} style={{ color: "hsl(var(--accent))" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Agent Directives
          </span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border-muted))", borderRadius: "8px", padding: "16px" }}>
          <p style={{ fontSize: "12px", color: "hsl(var(--text-muted))", lineHeight: "1.5" }}>
            Input guidelines that specialize this agent's operational focus. These rules modify the agent's contextual prompt boundaries.
          </p>

          <textarea
            value={directives}
            onChange={(e) => setDirectives(e.target.value)}
            style={{
              flex: 1,
              width: "100%",
              minHeight: "220px",
              backgroundColor: "hsl(var(--bg-base))",
              border: "1px solid hsl(var(--border-muted))",
              borderRadius: "6px",
              padding: "12px",
              color: "hsl(var(--text-primary))",
              fontFamily: "monospace",
              fontSize: "11px",
              lineHeight: "1.6",
              resize: "none"
            }}
          />

          <button
            onClick={handleSave}
            style={{
              backgroundColor: "hsl(var(--bg-elevated))",
              color: "hsl(var(--text-primary))",
              border: "1px solid hsl(var(--border-muted))",
              borderRadius: "6px",
              padding: "10px",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Save Guidelines
          </button>
        </div>

      </div>

    </div>
  );
}
