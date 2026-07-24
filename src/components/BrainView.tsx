import React, { useState, useEffect } from "react";
import { FileText, Save, Plus, HardDrive, Cpu } from "lucide-react";
import { HelpButton } from "./tour/HelpButton";
import { useTour } from "./tour/TourProvider";

interface BrainViewProps {
  knowledgeBase: string;
  setKnowledgeBase: (kb: string) => void;
}

export function BrainView({ knowledgeBase, setKnowledgeBase }: BrainViewProps) {
  const { showContextualHelp, triggerHelpForSection } = useTour();
  const [localKB, setLocalKB] = useState(knowledgeBase);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [files, setFiles] = useState([
    { 
      name: "faq_refunds.md", 
      size: "2.4 KB", 
      type: "text/markdown",
      content: `# FAQ Refunds Policy\n\nWe process refunds for duplicate charges within 14 days of the transaction.\nAvoid refunds for annual plans unless approved by executive review.\nVerify customer Stripe ID before issuing refunds.`
    },
    { 
      name: "pricing_model_2026.md", 
      size: "4.1 KB", 
      type: "text/markdown",
      content: `# Pricing Model 2026\n\n1. Team plan: $99/mo (up to 5 members). Extra seats at $15/seat.\n2. Enterprise plan: $299/mo with priority queue processing.\n3. Billing cycles are automated via Stripe webhook syncs.`
    },
    { 
      name: "custom_domain_guide.md", 
      size: "1.8 KB", 
      type: "text/markdown",
      content: `# Custom Domain Verification Guide\n\nFor SSL verification on custom domains, the Cloudflare proxy must be set to 'DNS Only' (Gray Cloud mode) during installation.\nOnce verified, proxy mode can be re-enabled. Let's Encrypt certificates require port 80 routing.`
    }
  ]);

  const [selectedFileName, setSelectedFileName] = useState<string>("System Prompts (Core)");
  const [tempContent, setTempContent] = useState("");

  // Sync tempContent when selectedFileName changes
  useEffect(() => {
    if (selectedFileName === "System Prompts (Core)") {
      setTempContent(localKB);
    } else {
      const f = files.find(f => f.name === selectedFileName);
      setTempContent(f ? f.content : "");
    }
  }, [selectedFileName, files, localKB]);

  const handleSaveChanges = () => {
    if (selectedFileName === "System Prompts (Core)") {
      setLocalKB(tempContent);
      setKnowledgeBase(tempContent);
      setToastMessage("System Prompts successfully synchronized");
    } else {
      setFiles((prev) =>
        prev.map((f) =>
          f.name === selectedFileName ? { ...f, content: tempContent } : f
        )
      );
      setToastMessage(`Saved changes to ${selectedFileName}`);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulateUpload = () => {
    const defaultContents: Record<string, string> = {
      "stripe_setup_keys.md": "# Stripe API Configuration\n\nEnsure Stripe Webhook secret is configured in .env as STRIPE_WEBHOOK_SECRET.\nTest keys should start with sk_test_ and pk_test_. Live transactions are disabled.",
      "smtp_outgoing_resend.md": "# Outgoing Mail SMTP Resend\n\nResend API key is registered to process outbound transactional emails.\nDo not send bulk newsletters via transactional route. Rates are capped at 100/sec.",
      "sentry_error_indexing.md": "# Sentry Error Tracing Rules\n\nIgnore React static hook flag mismatch notices in console filters.\nCapture database locks and log write batch concurrency warnings for alert routing."
    };

    const names = ["stripe_setup_keys.md", "smtp_outgoing_resend.md", "sentry_error_indexing.md"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    if (files.find(f => f.name === randomName)) {
      setToastMessage("Document already exists");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const newFile = { 
      name: randomName, 
      size: "1.2 KB", 
      type: "text/markdown",
      content: defaultContents[randomName] || `# ${randomName}\n\nEmpty custom content.`
    };
    setFiles((prev) => [...prev, newFile]);
    setSelectedFileName(randomName);
    setToastMessage(`Simulated uploading: ${randomName}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div id="tour-brain-view" className="canvas" style={{ padding: "40px", overflowY: "auto", display: "flex", gap: "24px" }}>
      
      {/* Left panel: Document list index */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "hsl(var(--text-primary))", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Living Company Brain & Knowledge Graph</span>
              {showContextualHelp && (
                <HelpButton sectionId="company-brain" onClick={triggerHelpForSection} />
              )}
            </h1>
            <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "99px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "hsl(var(--success))", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              25 GRAPH ENTITY TYPES ACTIVE
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "hsl(var(--text-muted))" }}>
            Active organizational memory connecting Clients, SOWs, Linear Tasks, GitHub PRs, Deployments, and Stripe Invoices.
          </p>
        </div>

        {/* Text uploader list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Uploaded Knowledge Files
            </span>
            <button
              onClick={handleSimulateUpload}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: "hsl(var(--bg-elevated))",
                border: "1px solid hsl(var(--border-muted))",
                color: "hsl(var(--text-primary))",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: 600
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "white"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "hsl(var(--border-muted))"}
            >
              <Plus size={12} />
              <span>Simulate Upload</span>
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Core Prompts Row */}
            <div
              onClick={() => setSelectedFileName("System Prompts (Core)")}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                backgroundColor: selectedFileName === "System Prompts (Core)" ? "hsl(var(--bg-elevated))" : "hsl(var(--bg-surface))",
                border: `1px solid ${selectedFileName === "System Prompts (Core)" ? "white" : "hsl(var(--border-muted))"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Cpu size={16} style={{ color: "hsl(var(--accent))" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>System Prompts (Core)</span>
                  <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>System Configuration</span>
                </div>
              </div>
              <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>Active</span>
            </div>

            {/* Markdown Files List */}
            {files.map((file) => (
              <div
                key={file.name}
                onClick={() => setSelectedFileName(file.name)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  backgroundColor: selectedFileName === file.name ? "hsl(var(--bg-elevated))" : "hsl(var(--bg-surface))",
                  border: `1px solid ${selectedFileName === file.name ? "white" : "hsl(var(--border-muted))"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FileText size={16} style={{ color: "hsl(var(--text-muted))" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>{file.name}</span>
                    <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>{file.type}</span>
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>{file.size}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right panel: Active inline rules editor */}
      <div style={{ width: "380px", display: "flex", flexDirection: "column", gap: "12px" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {selectedFileName === "System Prompts (Core)" ? (
            <HardDrive size={16} style={{ color: "hsl(var(--accent))" }} />
          ) : (
            <FileText size={16} style={{ color: "hsl(var(--text-primary))" }} />
          )}
          <span style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-primary))", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {selectedFileName === "System Prompts (Core)" ? "Active System Prompts/Rules" : `File Editor: ${selectedFileName}`}
          </span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "hsl(var(--bg-surface))", border: "1px solid hsl(var(--border-muted))", borderRadius: "8px", padding: "16px" }}>
          <p style={{ fontSize: "12px", color: "hsl(var(--text-muted))", lineHeight: "1.5" }}>
            {selectedFileName === "System Prompts (Core)" 
              ? "Edit raw support rules below. These rules are injected directly into the Support Agent system instruction payload on every run."
              : `Review and modify content for ${selectedFileName}. Your changes will update the company context database.`}
          </p>

          <textarea
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            style={{
              flex: 1,
              width: "100%",
              minHeight: "280px",
              backgroundColor: "hsl(var(--bg-base))",
              border: "1px solid hsl(var(--border-muted))",
              borderRadius: "6px",
              padding: "12px",
              color: "hsl(var(--text-primary))",
              fontSize: "12px",
              fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
              lineHeight: "1.5",
              resize: "none"
            }}
          />

          <button
            onClick={handleSaveChanges}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: "hsl(var(--text-primary))",
              color: "hsl(var(--bg-base))",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
              border: "none"
            }}
          >
            <Save size={14} />
            <span>Save Changes</span>
          </button>
        </div>

      </div>

      {/* Synced confirmation Toast */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "hsl(var(--bg-elevated))",
            border: "1px solid hsl(var(--border-muted))",
            padding: "12px 16px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            color: "white",
            fontSize: "12px",
            zIndex: 999
          }}
        >
          <Save size={14} style={{ color: "hsl(var(--success))" }} />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
