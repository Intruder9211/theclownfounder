"use client";

import React from "react";
import { 
  Briefcase, 
  FileCheck2, 
  MessageSquare, 
  ArrowUpRight, 
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";

interface ClientHomeViewProps {
  clientName: string;
  companyName?: string;
  projects: any[];
  proposals: any[];
  timeline: any[];
  supportChat: any[];
  setTab: (tab: string) => void;
}

export function ClientHomeView({ clientName, companyName, projects, proposals, timeline, supportChat, setTab }: ClientHomeViewProps) {
  const pendingProposals = proposals.filter((p) => p.status === "PENDING");
  const activeProjects = projects.filter((p) => !p.isCompleted);
  const unreadMessagesCount = supportChat.filter((m) => m.sender === "support-ai").length;

  return (
    <div className="space-y-6 font-sans text-xs text-[#fafafa] max-w-5xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-[#121215] border border-[#27272a] space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-[#fafafa] flex items-center gap-2">
              <span>Welcome, {clientName || "Partner"}</span>
              <Sparkles size={16} className="text-emerald-400" />
            </h1>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              {companyName ? `${companyName} Client Hub.` : "Company Partner Hub."} Real-time project tracking, proposals, and support.
            </p>
          </div>

          <button
            onClick={() => setTab("support")}
            className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <MessageSquare size={14} />
            <span>Chat with Support AI</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Active Projects */}
        <div 
          onClick={() => setTab("projects")}
          className="p-4 rounded-xl bg-[#121215] border border-[#27272a] hover:border-emerald-500/40 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-[11px] font-mono uppercase tracking-wider">ACTIVE PROJECTS</span>
            <Briefcase size={14} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-[#fafafa]">{activeProjects.length}</div>
          <span className="text-[11px] text-[#a1a1aa] block truncate">
            {activeProjects.length > 0 ? activeProjects[0].name : "No active builds"}
          </span>
        </div>

        {/* Action Required Proposals */}
        <div 
          onClick={() => setTab("proposals")}
          className="p-4 rounded-xl bg-[#121215] border border-[#27272a] hover:border-amber-500/40 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-[11px] font-mono uppercase tracking-wider">PENDING PROPOSALS</span>
            <FileCheck2 size={14} className="text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-[#fafafa]">{pendingProposals.length}</div>
          <span className="text-[11px] text-amber-400 font-medium block truncate">
            {pendingProposals.length > 0 ? "Requires your review" : "All clear"}
          </span>
        </div>

        {/* Unread Support Messages */}
        <div 
          onClick={() => setTab("support")}
          className="p-4 rounded-xl bg-[#121215] border border-[#27272a] hover:border-indigo-500/40 transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-[11px] font-mono uppercase tracking-wider">SUPPORT MESSAGES</span>
            <MessageSquare size={14} className="text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-[#fafafa]">{unreadMessagesCount}</div>
          <span className="text-[11px] text-[#a1a1aa] block truncate">Support AI Agent Online</span>
        </div>

        {/* Recent Events */}
        <div 
          onClick={() => setTab("timeline")}
          className="p-4 rounded-xl bg-[#121215] border border-[#27272a] hover:border-[#3f3f46] transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-[11px] font-mono uppercase tracking-wider">TOTAL ACTIVITY</span>
            <Clock size={14} className="text-[#a1a1aa] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-[#fafafa]">{timeline.length}</div>
          <span className="text-[11px] text-[#a1a1aa] block truncate">Logged timeline events</span>
        </div>

      </div>

      {/* Main Grid: Pending Proposals & Recent Updates */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Proposals Needing Action */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs font-mono uppercase text-[#fafafa] tracking-wider flex items-center gap-2">
                <FileCheck2 size={14} className="text-amber-400" />
                <span>Pending Proposals ({pendingProposals.length})</span>
              </h3>
              <button 
                onClick={() => setTab("proposals")}
                className="text-[11px] font-mono text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowUpRight size={12} />
              </button>
            </div>

            {pendingProposals.length > 0 ? (
              <div className="space-y-3">
                {pendingProposals.map((prop) => (
                  <div 
                    key={prop.id}
                    onClick={() => setTab("proposals")}
                    className="p-4 rounded-lg bg-[#18181b] border border-[#27272a] hover:border-indigo-500/40 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#fafafa]">{prop.subject}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        ACTION REQUIRED
                      </span>
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] line-clamp-2">{prop.bodyText}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#18181b]/50 text-xs text-[#71717a] font-mono text-center">
                ✓ No pending proposals requiring approval right now.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs font-mono uppercase text-[#fafafa] tracking-wider flex items-center gap-2">
                <Clock size={14} className="text-emerald-400" />
                <span>Recent Activity</span>
              </h3>
              <button 
                onClick={() => setTab("timeline")}
                className="text-[11px] font-mono text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Timeline</span>
                <ArrowUpRight size={12} />
              </button>
            </div>

            <div className="space-y-3">
              {timeline.slice(0, 4).map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#fafafa]">{item.event}</span>
                    <span className="text-[10px] font-mono text-[#71717a]">{item.date}</span>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
