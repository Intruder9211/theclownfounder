"use client";

import React from "react";
import { Clock, CheckCircle2, FileCheck2, DollarSign, Rocket, HelpCircle } from "lucide-react";

interface ClientTimelineViewProps {
  timeline: any[];
}

export function ClientTimelineView({ timeline }: ClientTimelineViewProps) {
  return (
    <div className="space-y-6 font-sans text-xs text-[#fafafa] max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 rounded-xl bg-[#121215] border border-[#27272a]">
        <div>
          <h2 className="text-base font-bold text-[#fafafa] flex items-center gap-2">
            <Clock size={16} className="text-emerald-400" />
            <span>Project Activity Timeline</span>
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Chronological audit history of milestones, approvals, invoices, and deployments.
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          {timeline.length} Events Logged
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-6">
        {timeline && timeline.map((item, index) => {
          let icon = <CheckCircle2 size={16} className="text-emerald-400" />;
          if (item.type === "PROPOSAL") icon = <FileCheck2 size={16} className="text-amber-400" />;
          if (item.type === "FINANCE") icon = <DollarSign size={16} className="text-emerald-400" />;

          return (
            <div key={item.id} className="relative flex items-start gap-4">
              {/* Timeline Vertical Line */}
              {index !== timeline.length - 1 && (
                <span className="absolute left-4 top-8 bottom-0 w-0.5 bg-[#27272a] -translate-x-1/2" />
              )}

              {/* Icon Node */}
              <div className="w-8 h-8 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center shrink-0 z-10">
                {icon}
              </div>

              {/* Content */}
              <div className="flex-1 p-4 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#fafafa]">{item.event}</span>
                  <span className="text-[10px] font-mono text-[#71717a]">{item.date}</span>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
