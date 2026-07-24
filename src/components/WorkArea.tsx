import React, { useState } from "react";
import { Check, X, CreditCard, Sparkles, UserPlus, Building2, CheckCircle2 } from "lucide-react";
import { ProposalItem } from "./ProposalList";
import { approveNewClientProposal } from "@/app/actions";

interface WorkAreaProps {
  proposal: ProposalItem | null;
  onApprove: () => void;
  onReject: () => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  updateDraft: (id: string, text: string) => void;
  editorRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function WorkArea({
  proposal,
  onApprove,
  onReject,
  isEditing,
  setIsEditing,
  updateDraft,
  editorRef
}: WorkAreaProps) {
  if (!proposal) {
    return (
      <div
        className="canvas"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          color: "hsl(var(--text-dim))"
        }}
      >
        <span style={{ fontSize: "14px" }}>No proposal selected</span>
      </div>
    );
  }

  const [isProcessingLead, setIsProcessingLead] = useState(false);

  const handleCreateClientFromProposal = async () => {
    try {
      setIsProcessingLead(true);
      await approveNewClientProposal(proposal.id, "CREATE");
      setIsProcessingLead(false);
    } catch (err) {
      console.error(err);
      setIsProcessingLead(false);
    }
  };

  const handleIgnoreLead = async () => {
    try {
      setIsProcessingLead(true);
      await approveNewClientProposal(proposal.id, "IGNORE");
      setIsProcessingLead(false);
    } catch (err) {
      console.error(err);
      setIsProcessingLead(false);
    }
  };

  return (
    <div id="tour-work-area" className="canvas flex flex-col h-full overflow-hidden">
      {/* Subject Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid hsl(var(--border-muted))",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>{proposal.subject}</span>
      </div>

      {/* Sales AI Lead Detection Banner */}
      {proposal.isNewClientLead && (
        <div className="mx-6 my-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
              <Sparkles size={14} className="animate-pulse" />
              <span>SALES AI: NEW POTENTIAL CLIENT DETECTED</span>
            </div>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
              Source: Gmail
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[#09090b]/80 p-3 rounded-lg border border-amber-500/20">
            <div>
              <span className="text-[10px] font-mono text-[#71717a] block">COMPANY</span>
              <span className="font-medium text-[#fafafa]">{proposal.detectedCompany || "Inbound Contact"}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#71717a] block">CONTACT</span>
              <span className="font-medium text-[#fafafa]">{proposal.detectedContact || proposal.senderName || "Unknown"}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#71717a] block">EMAIL</span>
              <span className="font-medium text-[#fafafa] truncate">{proposal.senderEmail}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#71717a] block">SUGGESTED TYPE</span>
              <span className="font-medium text-amber-400 font-mono">{proposal.suggestedType || "CLIENT"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCreateClientFromProposal}
              disabled={isProcessingLead}
              className="px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <UserPlus size={13} />
              <span>{isProcessingLead ? "Creating..." : "Create Client Profile"}</span>
            </button>

            <button
              onClick={handleIgnoreLead}
              disabled={isProcessingLead}
              className="px-3 py-1.5 rounded-md bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] text-xs font-medium border border-[#27272a] transition-all cursor-pointer disabled:opacity-50"
            >
              Ignore
            </button>
          </div>
        </div>
      )}

      {/* Main split details panel */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Left Sub-column: Stripe Context metadata */}
        <div
          style={{
            width: "240px",
            borderRight: "1px solid hsl(var(--border-muted))",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            overflowY: "auto"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Customer Profile
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>
                {proposal.senderName || "Unknown"}
              </span>
              <span style={{ fontSize: "12px", color: "hsl(var(--text-muted))", wordBreak: "break-all" }}>
                {proposal.senderEmail}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Billing Status
            </span>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border-muted))", borderRadius: "8px", padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <CreditCard size={14} style={{ color: "hsl(var(--accent))" }} />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>Stripe Connected</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "hsl(var(--text-muted))" }}>Active Plan</span>
                <span style={{ fontWeight: 600, color: "hsl(var(--success))" }}>
                  {proposal.stripePlan || "Free"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "hsl(var(--text-muted))" }}>LTV</span>
                <span style={{ fontWeight: 600, color: "hsl(var(--text-primary))" }}>
                  ${proposal.stripeLTV || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right main canvas area: original email + draft editor */}
        <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>
          
          {/* Original message */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Original Message
            </span>
            <div
              style={{
                backgroundColor: "hsl(var(--bg-surface))",
                border: "1px solid hsl(var(--border-muted))",
                borderRadius: "8px",
                padding: "16px",
                color: "hsl(var(--text-muted))",
                fontSize: "13px",
                whiteSpace: "pre-wrap",
                lineHeight: "1.6"
              }}
            >
              {proposal.bodyText}
            </div>
          </div>

          {/* AI Proposed draft email editor */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Proposed Draft Reply
              </span>
              {isEditing && (
                <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>
                  Editing... Press <span className="keycap">Esc</span> to unfocus
                </span>
              )}
            </div>
            <textarea
              ref={editorRef}
              value={proposal.draftReply}
              onChange={(e) => updateDraft(proposal.id, e.target.value)}
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
              style={{
                width: "100%",
                flex: 1,
                minHeight: "180px",
                backgroundColor: "hsl(var(--bg-base))",
                border: isEditing ? "1px solid hsl(var(--border-focus))" : "1px solid hsl(var(--border-muted))",
                borderRadius: "8px",
                padding: "16px",
                color: "hsl(var(--text-primary))",
                fontFamily: "inherit",
                fontSize: "13px",
                lineHeight: "1.6",
                resize: "none",
                transition: "border-color 0.15s ease"
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Bottom Hotkey Action Bar */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid hsl(var(--border-muted))",
          backgroundColor: "hsl(var(--bg-surface))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={onApprove}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              backgroundColor: "hsl(var(--text-primary))",
              color: "hsl(var(--bg-base))",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
              border: "none"
            }}
          >
            <Check size={14} />
            <span>Approve & Send</span>
            <span className="keycap" style={{ backgroundColor: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.6)" }}>A</span>
          </button>

          <button
            onClick={onReject}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              backgroundColor: "transparent",
              border: "1px solid hsl(var(--border-muted))",
              color: "hsl(var(--text-muted))",
              fontSize: "12px",
              cursor: "pointer",
              transition: "border-color 0.15s ease, color 0.15s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "hsl(var(--error))";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "hsl(var(--border-muted))";
              e.currentTarget.style.color = "hsl(var(--text-muted))";
            }}
          >
            <X size={14} />
            <span>Reject & Archive</span>
            <span className="keycap">R</span>
          </button>
        </div>

        <div style={{ display: "flex", gap: "12px", color: "hsl(var(--text-dim))", fontSize: "11px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span className="keycap">E</span>
            <span>Edit draft</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span className="keycap">Esc</span>
            <span>Unfocus</span>
          </div>
        </div>
      </div>
    </div>
  );
}
