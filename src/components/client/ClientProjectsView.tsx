"use client";

import React from "react";
import { Briefcase, CheckCircle2, Clock, Layers, Sparkles } from "lucide-react";

interface ClientProjectsViewProps {
  projects: any[];
}

export function ClientProjectsView({ projects }: ClientProjectsViewProps) {
  return (
    <div className="space-y-6 font-sans text-xs text-[#fafafa] max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 rounded-xl bg-[#121215] border border-[#27272a]">
        <div>
          <h2 className="text-base font-bold text-[#fafafa] flex items-center gap-2">
            <Briefcase size={16} className="text-emerald-400" />
            <span>Active Projects & Deliverables</span>
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Real-time milestone progress tracked by engineering and quality assurance.
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          {projects.length} Active Builds
        </span>
      </div>

      {/* Projects List */}
      {projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((proj) => {
            const isDone = proj.isCompleted;
            const progress = isDone ? 100 : 75;

            return (
              <div key={proj.id} className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4 shadow-sm">
                
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272a]">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-[#fafafa] flex items-center gap-2">
                      <span>{proj.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDone
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      }`}>
                        {isDone ? "DELIVERED" : "IN PROGRESS"}
                      </span>
                    </span>
                    <span className="text-[11px] text-[#a1a1aa] block">
                      Assigned AI Executive Units: Engineering, QA, Support, Operations
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="text-[10px] font-mono text-[#71717a] block">ESTIMATED DELIVERY</span>
                      <span className="font-semibold text-xs text-[#fafafa]">This Friday</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#a1a1aa]">
                    <span>Build Milestone Completion</span>
                    <span className="text-emerald-400 font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-[#09090b] h-2.5 rounded-full overflow-hidden border border-[#27272a]">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>

                {/* Milestone Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 block font-semibold">MILESTONE 1: IN-SCOPE REPAIR</span>
                    <span className="text-xs text-[#fafafa] font-medium block">Sprint 4 Architecture & Design Tokens</span>
                    <span className="text-[10px] text-[#71717a]">✓ Completed & Verified</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 block font-semibold">MILESTONE 2: CORE LOGIC</span>
                    <span className="text-xs text-[#fafafa] font-medium block">Stripe Webhooks & API Integration</span>
                    <span className="text-[10px] text-indigo-400">⚡ In QA Audit Review</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
                    <span className="text-[10px] font-mono text-[#71717a] block font-semibold">MILESTONE 3: RELEASE</span>
                    <span className="text-xs text-[#fafafa] font-medium block">Staging Deployment & Final Acceptance</span>
                    <span className="text-[10px] text-[#71717a]">Queued for Release</span>
                  </div>
                </div>

                {/* Recent Verified Developer Notes */}
                {proj.developerNotes && (
                  <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                      Engineering Status Update
                    </span>
                    <p className="text-xs text-[#fafafa] leading-relaxed">
                      {proj.developerNotes}
                    </p>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-[#121215] border border-[#27272a] text-center space-y-2">
          <Briefcase size={24} className="mx-auto text-[#71717a]" />
          <h3 className="font-bold text-xs text-[#fafafa]">No Active Projects Yet</h3>
          <p className="text-xs text-[#a1a1aa]">Your active software builds will appear here as soon as they are initialized by your account manager.</p>
        </div>
      )}

    </div>
  );
}
