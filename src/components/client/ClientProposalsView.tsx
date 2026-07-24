"use client";

import React, { useState } from "react";
import { FileCheck2, Check, X, MessageSquare, Send, CheckCircle2, Clock } from "lucide-react";
import { clientApproveProposal, clientRejectProposal } from "@/app/actions";

interface ClientProposalsViewProps {
  proposals: any[];
  onRefresh: () => void;
  setTab: (tab: string) => void;
}

export function ClientProposalsView({ proposals, onRefresh, setTab }: ClientProposalsViewProps) {
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
    proposals.length > 0 ? proposals[0].id : null
  );
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProposal = proposals.find((p) => p.id === selectedProposalId) || proposals[0];

  const handleApprove = async () => {
    if (!selectedProposal) return;
    try {
      setIsSubmitting(true);
      await clientApproveProposal(selectedProposal.id, commentText);
      setIsSubmitting(false);
      setCommentText("");
      onRefresh();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProposal) return;
    try {
      setIsSubmitting(true);
      await clientRejectProposal(selectedProposal.id, commentText);
      setIsSubmitting(false);
      setCommentText("");
      onRefresh();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs text-[#fafafa] max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 rounded-xl bg-[#121215] border border-[#27272a]">
        <div>
          <h2 className="text-base font-bold text-[#fafafa] flex items-center gap-2">
            <FileCheck2 size={16} className="text-amber-400" />
            <span>Proposals, Scope Changes & Change Orders</span>
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Review official change requests, SOW quotations, and delivery notices.
          </p>
        </div>
        <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          {proposals.filter((p) => p.status === "PENDING").length} Action Required
        </span>
      </div>

      {/* Main Split Grid */}
      {proposals && proposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Proposals List */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-[#a1a1aa] px-1">
              Proposal History ({proposals.length})
            </h3>

            <div className="space-y-2">
              {proposals.map((prop) => {
                const isSelected = prop.id === (selectedProposal ? selectedProposal.id : null);
                const isPending = prop.status === "PENDING";
                const isApproved = prop.status === "APPROVED";

                return (
                  <div
                    key={prop.id}
                    onClick={() => setSelectedProposalId(prop.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-[#18181b] border-indigo-500 text-[#fafafa] shadow-md"
                        : "bg-[#121215] border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#fafafa] line-clamp-1">
                        {prop.subject}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                        isApproved
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : isPending
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {prop.status}
                      </span>
                    </div>
                    <p className="text-[11px] line-clamp-2">{prop.bodyText}</p>
                    <span className="text-[10px] font-mono text-[#71717a] block">
                      {new Date(prop.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Proposal Detail & Action Console */}
          {selectedProposal && (
            <div className="md:col-span-7 space-y-4">
              <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-5">
                
                {/* Proposal Title Header */}
                <div className="space-y-2 pb-4 border-b border-[#27272a]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                      Official Proposal Document
                    </span>
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded border ${
                      selectedProposal.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : selectedProposal.status === "PENDING"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      STATUS: {selectedProposal.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#fafafa] leading-snug">
                    {selectedProposal.subject}
                  </h3>
                </div>

                {/* Proposal Body */}
                <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-3">
                  <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider block">
                    Scope Details & Proposal Breakdown
                  </span>
                  <div className="text-xs text-[#fafafa] whitespace-pre-wrap leading-relaxed">
                    {selectedProposal.draftReply || selectedProposal.bodyText}
                  </div>
                </div>

                {/* Comment & Question Box */}
                {selectedProposal.status === "PENDING" ? (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-[#a1a1aa]">
                        Client Comments or Questions (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Approved. Please proceed with Friday release..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={handleApprove}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Check size={15} />
                        <span>Approve Proposal</span>
                      </button>

                      <button
                        onClick={handleReject}
                        disabled={isSubmitting}
                        className="py-2.5 px-4 rounded-lg bg-[#18181b] hover:bg-red-500/10 text-[#a1a1aa] hover:text-red-400 border border-[#27272a] hover:border-red-500/30 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <X size={15} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>This proposal has been {selectedProposal.status.toLowerCase()} and recorded in project history.</span>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="p-8 rounded-xl bg-[#121215] border border-[#27272a] text-center space-y-2">
          <FileCheck2 size={24} className="mx-auto text-[#71717a]" />
          <h3 className="font-bold text-xs text-[#fafafa]">No Proposals Yet</h3>
          <p className="text-xs text-[#a1a1aa]">New change orders and official quotations will appear here for your authorization.</p>
        </div>
      )}

    </div>
  );
}
