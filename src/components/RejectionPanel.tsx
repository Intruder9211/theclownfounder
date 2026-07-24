import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, Send, X } from "lucide-react";

interface RejectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
  onSkip: () => void;
}

export function RejectionPanel({ isOpen, onClose, onSubmit, onSkip }: RejectionPanelProps) {
  const [feedback, setFeedback] = useState("");
  const [selectedPills, setSelectedPills] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const presets = [
    "Tone is too formal",
    "Pricing details are incorrect",
    "Missing links / reference details",
    "Wrong refund timeframe policy"
  ];

  // Auto-focus textarea when opened
  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  const handleTogglePill = (pill: string) => {
    setSelectedPills((prev) =>
      prev.includes(pill) ? prev.filter((p) => p !== pill) : [...prev, pill]
    );
  };

  const handleConfirmSubmit = () => {
    const combinedFeedback = [
      ...selectedPills,
      ...(feedback.trim() ? [feedback.trim()] : [])
    ].join(". ");

    onSubmit(combinedFeedback || "Archived by user");
    setFeedback("");
    setSelectedPills([]);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "hsl(var(--bg-surface))",
          border: "1px solid hsl(var(--border-muted))",
          borderRadius: "8px",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={16} style={{ color: "hsl(var(--error))" }} />
            <span style={{ fontSize: "14px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>Why Reject this Proposal?</span>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "hsl(var(--text-dim))"
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Info */}
        <p style={{ fontSize: "12px", color: "hsl(var(--text-muted))", lineHeight: "1.5" }}>
          Rejecting archiving proposals helps refine agent parameters. Choose a feedback tag or type custom guidelines.
        </p>

        {/* Preset tags/pills grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {presets.map((pill) => {
            const isSelected = selectedPills.includes(pill);
            return (
              <button
                key={pill}
                onClick={() => handleTogglePill(pill)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 500,
                  cursor: "pointer",
                  backgroundColor: isSelected ? "hsl(var(--accent))" : "hsl(var(--bg-elevated))",
                  border: "1px solid " + (isSelected ? "hsl(var(--border-focus))" : "hsl(var(--border-muted))"),
                  color: isSelected ? "white" : "hsl(var(--text-muted))",
                  transition: "all 0.15s ease"
                }}
              >
                {pill}
              </button>
            );
          })}
        </div>

        {/* Text Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase" }}>
            Additional Context (Optional)
          </label>
          <textarea
            ref={textareaRef}
            placeholder="Type feedback, e.g. 'We don't give refunds for corporate subscriptions...'"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{
              width: "100%",
              height: "80px",
              borderRadius: "6px",
              backgroundColor: "hsl(var(--bg-base))",
              border: "1px solid hsl(var(--border-muted))",
              color: "hsl(var(--text-primary))",
              padding: "10px",
              fontSize: "12px",
              lineHeight: "1.5",
              resize: "none"
            }}
          />
        </div>

        {/* Actions panel */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
          <button
            onClick={onSkip}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              backgroundColor: "transparent",
              border: "1px solid transparent",
              color: "hsl(var(--text-muted))",
              fontSize: "12px",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "white"}
            onMouseLeave={(e) => e.currentTarget.style.color = "hsl(var(--text-muted))"}
          >
            Skip Feedback
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={onClose}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                backgroundColor: "transparent",
                border: "1px solid hsl(var(--border-muted))",
                color: "hsl(var(--text-muted))",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmSubmit}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                backgroundColor: "hsl(var(--text-primary))",
                color: "hsl(var(--bg-base))",
                fontWeight: 600,
                fontSize: "12px",
                cursor: "pointer",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Send size={12} />
              <span>Submit & Archive</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
