import React from "react";
import { Mail } from "lucide-react";

export interface ProposalItem {
  id: string;
  status: string;
  senderEmail: string;
  senderName: string | null;
  subject: string;
  bodyText: string;
  draftReply: string;
  createdAt: Date;
  stripePlan?: string;
  stripeLTV?: number;
  isNewClientLead?: boolean;
  detectedCompany?: string | null;
  detectedContact?: string | null;
  suggestedType?: string | null;
  clientId?: string | null;
}

interface ProposalListProps {
  proposals: ProposalItem[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  dismissingId: string | null;
}

export function ProposalList({
  proposals,
  selectedId,
  setSelectedId,
  dismissingId
}: ProposalListProps) {
  return (
    <div id="tour-proposals-list" className="feed">
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid hsl(var(--border-muted))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>Inbox Queue</span>
        <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>
          {proposals.length} item{proposals.length !== 1 && "s"}
        </span>
      </div>

      {/* List cards */}
      <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", flex: 1 }}>
        {proposals.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              padding: "48px 24px",
              color: "hsl(var(--text-muted))",
              textAlign: "center",
              gap: "12px"
            }}
          >
            <div style={{ padding: "12px", borderRadius: "12px", backgroundColor: "hsl(var(--bg-elevated))", border: "1px solid hsl(var(--border-muted))" }}>
              <Mail size={24} style={{ color: "hsl(var(--accent))" }} />
            </div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>No pending proposals</div>
            <p style={{ fontSize: "12px", color: "hsl(var(--text-dim))", maxWidth: "240px", lineHeight: "1.5", margin: 0 }}>
              All client requests have been processed. New inbound client emails will appear here automatically.
            </p>
          </div>
        ) : (
          proposals.map((proposal) => {
            const isSelected = proposal.id === selectedId;
            const isDismissing = proposal.id === dismissingId;
            
            return (
              <div
                key={proposal.id}
                onClick={() => setSelectedId(proposal.id)}
                className={isDismissing ? "dismissing-card" : ""}
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "hsl(var(--bg-elevated))" : "transparent",
                  borderBottom: "1px solid hsl(var(--border-muted))",
                  borderLeft: isSelected ? "2px solid hsl(var(--border-focus))" : "2px solid transparent",
                  transition: "background-color 0.15s ease, border-left-color 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                {/* Meta details (Integration + Plan name & Action Ready Tag) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "hsl(var(--text-muted))" }}>
                    <Mail size={12} style={{ color: isSelected ? "hsl(var(--accent))" : "hsl(var(--text-dim))" }} />
                    <span style={{ fontSize: "11px", fontWeight: 500 }}>
                      {proposal.senderName || proposal.senderEmail}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "1px 6px",
                        borderRadius: "4px",
                        backgroundColor: proposal.stripePlan === "Pro" || proposal.stripePlan === "Enterprise" ? "rgba(16, 185, 129, 0.15)" : "hsl(var(--bg-card))",
                        color: proposal.stripePlan === "Pro" || proposal.stripePlan === "Enterprise" ? "hsl(var(--success))" : "hsl(var(--text-dim))",
                        border: "1px solid hsl(var(--border-muted))"
                      }}
                    >
                      {proposal.stripePlan || "Free"} {proposal.stripeLTV ? `($${proposal.stripeLTV})` : ""}
                    </span>
                  </div>
                </div>

                {/* Subject & body snippet */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "hsl(var(--text-primary))",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {proposal.subject}
                  </span>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "hsl(var(--text-muted))",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {proposal.bodyText}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
