import React, { useState } from "react";
import { Sparkles, CheckCircle, Moon, Sun, Monitor, Compass, HelpCircle, RotateCcw } from "lucide-react";
import { useTour } from "./tour/TourProvider";
import { resetOnboardingProgress } from "@/app/actions";

interface MockTriggersProps {
  onTriggerMock: (template: string) => void;
  geminiKey?: string;
  setGeminiKey?: (key: string) => void;
  stripeKey: string;
  setStripeKey: (key: string) => void;
  resendKey: string;
  setResendKey: (key: string) => void;
  themeMode: "dark" | "light" | "system";
  setThemeMode: (mode: "dark" | "light" | "system") => void;
}

export function MockTriggers({
  onTriggerMock,
  geminiKey = "",
  setGeminiKey,
  stripeKey,
  setStripeKey,
  resendKey,
  setResendKey,
  themeMode,
  setThemeMode
}: MockTriggersProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { startTour, showContextualHelp, toggleContextualHelp } = useTour();

  const handleResetProgress = async () => {
    try {
      localStorage.removeItem("clownfounder_onboarding_completed");
      localStorage.removeItem("clownfounder_tour_completed");
      await resetOnboardingProgress();
      setToastMessage("Onboarding progress reset. Reloading setup wizard...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulate = (template: string, name: string) => {
    onTriggerMock(template);
    setToastMessage(`Simulated support event received: ${name}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="canvas" style={{ padding: "40px", overflowY: "auto", display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "600px", width: "100%", display: "flex", flexDirection: "column", gap: "32px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>Settings & Integrations</h1>
          <p style={{ fontSize: "13px", color: "hsl(var(--text-muted))" }}>
            Configure your system appearance, API credentials, and simulate support webhook events.
          </p>
        </div>

        {/* Onboarding & Guidance Control Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", border: "1px solid hsl(var(--border-muted))", borderRadius: "8px", padding: "24px", backgroundColor: "hsl(var(--bg-surface))" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "hsl(var(--text-primary))", display: "flex", alignItems: "center", gap: "8px" }}>
              <Compass size={16} className="text-indigo-400" />
              <span>Onboarding & Guidance</span>
            </h2>
            <span style={{ fontSize: "12px", color: "hsl(var(--text-muted))" }}>Manage product tour walkthroughs and contextual help tooltips</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "6px", backgroundColor: "hsl(var(--bg-base))", border: "1px solid hsl(var(--border-muted))" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>Interactive Product Tour</span>
                <span style={{ fontSize: "11px", color: "hsl(var(--text-muted))" }}>Take a 3-minute guided walkthrough of all executive sections</span>
              </div>
              <button
                type="button"
                onClick={startTour}
                className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Compass size={13} />
                <span>Restart Tour</span>
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "6px", backgroundColor: "hsl(var(--bg-base))", border: "1px solid hsl(var(--border-muted))" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>Show Contextual Help</span>
                <span style={{ fontSize: "11px", color: "hsl(var(--text-muted))" }}>Display small (?) icons next to section headers for instant explanations</span>
              </div>
              <button
                type="button"
                onClick={() => toggleContextualHelp(!showContextualHelp)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${
                  showContextualHelp
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-[#18181b] text-[#71717a] border-[#27272a]"
                }`}
              >
                {showContextualHelp ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "6px", backgroundColor: "hsl(var(--bg-base))", border: "1px solid hsl(var(--border-muted))" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>Reset Onboarding Progress</span>
                <span style={{ fontSize: "11px", color: "hsl(var(--text-muted))" }}>Re-experience the initial Company Setup Wizard from scratch</span>
              </div>
              <button
                type="button"
                onClick={handleResetProgress}
                className="px-3 py-1.5 rounded-md bg-[#18181b] hover:bg-red-500/10 hover:text-red-400 text-[#a1a1aa] font-medium text-xs transition-all border border-[#27272a] hover:border-red-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Progress</span>
              </button>
            </div>
          </div>
        </div>

        {/* Theme Appearance Control Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", border: "1px solid hsl(var(--border-muted))", borderRadius: "8px", padding: "24px", backgroundColor: "hsl(var(--bg-surface))" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>Appearance & Theme</h2>
            <span style={{ fontSize: "12px", color: "hsl(var(--text-muted))" }}>Choose your preferred interface theme mode</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            <button
              type="button"
              onClick={() => setThemeMode("dark")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "16px 12px",
                borderRadius: "8px",
                border: themeMode === "dark" ? "2px solid hsl(var(--accent))" : "1px solid hsl(var(--border-muted))",
                backgroundColor: themeMode === "dark" ? "hsl(var(--bg-elevated))" : "hsl(var(--bg-base))",
                color: themeMode === "dark" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Moon size={18} style={{ color: themeMode === "dark" ? "hsl(var(--accent))" : "hsl(var(--text-dim))" }} />
              <span style={{ fontSize: "12px", fontWeight: 600 }}>Dark Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode("light")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "16px 12px",
                borderRadius: "8px",
                border: themeMode === "light" ? "2px solid hsl(var(--accent))" : "1px solid hsl(var(--border-muted))",
                backgroundColor: themeMode === "light" ? "hsl(var(--bg-elevated))" : "hsl(var(--bg-base))",
                color: themeMode === "light" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Sun size={18} style={{ color: themeMode === "light" ? "hsl(var(--warning, #f59e0b))" : "hsl(var(--text-dim))" }} />
              <span style={{ fontSize: "12px", fontWeight: 600 }}>Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode("system")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "16px 12px",
                borderRadius: "8px",
                border: themeMode === "system" ? "2px solid hsl(var(--accent))" : "1px solid hsl(var(--border-muted))",
                backgroundColor: themeMode === "system" ? "hsl(var(--bg-elevated))" : "hsl(var(--bg-base))",
                color: themeMode === "system" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Monitor size={18} style={{ color: themeMode === "system" ? "hsl(var(--accent))" : "hsl(var(--text-dim))" }} />
              <span style={{ fontSize: "12px", fontWeight: 600 }}>System</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", border: "1px solid hsl(var(--border-muted))", borderRadius: "8px", padding: "24px", backgroundColor: "hsl(var(--bg-surface))" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "hsl(var(--text-primary))", marginBottom: "4px" }}>API Credentials</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-muted))" }}>Gemini LLM Agent API Key</label>
                {geminiKey ? (
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "hsl(var(--success))", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "1px 6px", borderRadius: "4px" }}>
                    ✓ Synced & Saved
                  </span>
                ) : (
                  <span style={{ fontSize: "10px", color: "hsl(var(--text-dim))" }}>Optional (LLM Chat & Analysis)</span>
                )}
              </div>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey && setGeminiKey(e.target.value)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "6px",
                  backgroundColor: "hsl(var(--bg-base))",
                  border: geminiKey ? "1px solid hsl(var(--success))" : "1px solid hsl(var(--border-muted))",
                  color: "hsl(var(--text-primary))",
                  fontSize: "13px"
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-muted))" }}>Stripe Secret Key</label>
              <input
                type="password"
                placeholder="sk_test_..."
                value={stripeKey}
                onChange={(e) => setStripeKey(e.target.value)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "6px",
                  backgroundColor: "hsl(var(--bg-base))",
                  border: "1px solid hsl(var(--border-muted))",
                  color: "hsl(var(--text-primary))",
                  fontSize: "13px"
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-muted))" }}>Resend API Key</label>
              <input
                type="password"
                placeholder="re_..."
                value={resendKey}
                onChange={(e) => setResendKey(e.target.value)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "6px",
                  backgroundColor: "hsl(var(--bg-base))",
                  border: "1px solid hsl(var(--border-muted))",
                  color: "hsl(var(--text-primary))",
                  fontSize: "13px"
                }}
              />
            </div>
          </div>
        </div>

        {/* Event Simulator */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", border: "1px solid hsl(var(--border-muted))", borderRadius: "8px", padding: "24px", backgroundColor: "hsl(var(--bg-surface))" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={16} style={{ color: "hsl(var(--accent))" }} />
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>Mock Webhook Trigger Console</h2>
          </div>
          <p style={{ fontSize: "12px", color: "hsl(var(--text-muted))" }}>
            Select a template below to simulate incoming client Slack/Email scope requests. This tests SOW verification, Linear issue generation, and Stripe Change Order drafting.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={() => handleSimulate("new-lead", "Sales AI: New Potential Client Detected")}
              style={{
                padding: "12px",
                borderRadius: "6px",
                backgroundColor: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "hsl(var(--warning, #f59e0b))",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "hsl(var(--warning, #f59e0b))"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.3)"}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontWeight: 600 }}>Simulate Inbound Lead (Sales AI Auto-Detection)</span>
                <span style={{ fontSize: "11px", opacity: 0.9 }}>From Alex Rivera (HyperGrowth Labs) • Triggers Sales AI "Create Client Profile" proposal</span>
              </div>
            </button>

            <button
              onClick={() => handleSimulate("refund", "Out-of-Scope Client Request ($1,200 Change Order)")}
              style={{
                padding: "12px",
                borderRadius: "6px",
                backgroundColor: "hsl(var(--bg-base))",
                border: "1px solid hsl(var(--border-muted))",
                color: "hsl(var(--text-primary))",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "hsl(var(--text-dim))"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "hsl(var(--border-muted))"}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontWeight: 600 }}>Simulate Out-of-Scope Client Request</span>
                <span style={{ fontSize: "11px", color: "hsl(var(--text-muted))" }}>From Sarah (Acme Corp) • Checkout Redesign ($1,200 Change Order + Linear DEV-104)</span>
              </div>
            </button>

            <button
              onClick={() => handleSimulate("invoice", "Retainer Bug Report (Linear DEV-105)")}
              style={{
                padding: "12px",
                borderRadius: "6px",
                backgroundColor: "hsl(var(--bg-base))",
                border: "1px solid hsl(var(--border-muted))",
                color: "hsl(var(--text-primary))",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "hsl(var(--text-dim))"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "hsl(var(--border-muted))"}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontWeight: 600 }}>Simulate Retainer Bug Fix Request</span>
                <span style={{ fontSize: "11px", color: "hsl(var(--text-muted))" }}>From David (FinTech Labs) • IN-SCOPE (Linear DEV-105)</span>
              </div>
            </button>

            <button
              onClick={() => handleSimulate("custom_domain", "Feature Request SOW Verification")}
              style={{
                padding: "12px",
                borderRadius: "6px",
                backgroundColor: "hsl(var(--bg-base))",
                border: "1px solid hsl(var(--border-muted))",
                color: "hsl(var(--text-primary))",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "hsl(var(--text-dim))"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "hsl(var(--border-muted))"}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontWeight: 600 }}>Simulate Domain CNAME Error</span>
                <span style={{ fontSize: "11px", color: "hsl(var(--text-muted))" }}>From Charlie (charlie@team.com) • Stripe Team Subscriber</span>
              </div>
            </button>
          </div>
        </div>

        {/* Simulated Webhook Notification toast */}
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
              color: "hsl(var(--text-primary))",
              fontSize: "12px",
              zIndex: 999
            }}
          >
            <CheckCircle size={14} style={{ color: "hsl(var(--success))" }} />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
}
