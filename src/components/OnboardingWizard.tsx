"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Globe, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Bot, 
  Brain, 
  Mail, 
  GitBranch, 
  CreditCard, 
  Zap, 
  Send, 
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { ClownAiLogoMark } from "@/app/components/ClownAiLogoMark";

interface OnboardingWizardProps {
  onComplete: (data: any) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<number>(0); // 0 = Welcome screen
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [buildStatusIndex, setBuildStatusIndex] = useState<number>(0);

  // Form State
  const [companyType, setCompanyType] = useState<string>("Software Agency");
  const [companyName, setCompanyName] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("UTC-5 (EST)");
  const [workingHours, setWorkingHours] = useState<string>("09:00 AM - 05:00 PM");
  const [currency, setCurrency] = useState<string>("USD ($)");

  // Integrations state
  const [services, setServices] = useState<{ [key: string]: boolean }>({
    Gmail: false,
    GitHub: false,
    Stripe: false,
    Linear: false,
    Resend: false,
    Slack: false
  });

  // Company Brain Initial Content
  const [brainContent, setBrainContent] = useState<string>(
    `# Company Operating Guidelines\n\n## 1. Scope & Retainer Rules\n- Bug fixes and core component maintenance are IN SCOPE under retainer.\n- Custom feature additions outside sprint deliverables generate a $1,200 Change Order.\n\n## 2. Refund Policy\n- Duplicate charges refunded within 14 days.\n- Annual plan refunds require executive authorization.`
  );

  // First Client State
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");

  const toggleService = (name: string) => {
    setServices((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleBuildCompany = async () => {
    setIsBuilding(true);
    const buildSteps = [
      "Creating Workspace...",
      "Initializing AI Departments...",
      "Preparing Company Brain...",
      "Configuring Company Memory...",
      "Ready."
    ];

    for (let i = 0; i < buildSteps.length; i++) {
      setBuildStatusIndex(i);
      await new Promise((res) => setTimeout(res, 600));
    }

    onComplete({
      companyName: companyName || "My Software Studio",
      companyType,
      website,
      timezone,
      workingHours,
      currency,
      brainContent,
      clientName,
      clientEmail,
      services
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-[#fafafa] flex items-center justify-center p-4 sm:p-6 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#121215] border border-[#27272a] p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Subtle Ambient Light Beam */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#27272a] pb-6">
          <div className="flex items-center gap-3">
            <ClownAiLogoMark className="w-7 h-7" />
            <span className="font-bold text-base tracking-tight text-[#fafafa]">clownfounder</span>
          </div>
          {step > 0 && !isBuilding && (
            <div className="font-mono text-xs text-[#71717a]">
              STEP <span className="text-indigo-400 font-bold">{step}</span> OF 6
            </div>
          )}
        </div>

        {/* WELCOME SCREEN (STEP 0) */}
        {step === 0 && (
          <div className="space-y-6 text-center py-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18181b] border border-[#27272a] text-xs text-indigo-300 font-mono">
              <Sparkles size={13} className="text-indigo-400" />
              <span>ESTIMATED SETUP TIME: 5–7 MINUTES</span>
            </div>

            <div className="space-y-3 max-w-lg mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                Welcome to clownfounder.
              </h1>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                Your company has no operational history yet. Let's build your AI company step-by-step with clean boundaries and outcome alignment.
              </p>
            </div>

            <div className="pt-4 max-w-sm mx-auto">
              <button
                onClick={() => setStep(1)}
                className="w-full py-3.5 bg-[#fafafa] hover:bg-white text-[#09090b] font-semibold text-xs rounded-md shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Begin Company Setup</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: CHOOSE COMPANY TYPE */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-indigo-400 uppercase">STEP 01</div>
              <h2 className="text-xl font-bold text-[#fafafa]">Choose Company Type</h2>
              <p className="text-xs text-[#a1a1aa]">Select your core operational business model.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { type: "Software Agency", desc: "Client retainers & custom development" },
                { type: "SaaS", desc: "Subscription products & recurring revenue" },
                { type: "Consultancy", desc: "Advisory services & hourly deliverables" },
                { type: "Startup", desc: "Fast-iteration product engineering" },
                { type: "Other", desc: "Custom business operations model" }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setCompanyType(item.type)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    companyType === item.type
                      ? "border-indigo-500 bg-indigo-950/20 text-[#fafafa] shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "border-[#27272a] bg-[#09090b] text-[#a1a1aa] hover:border-[#3f3f46]"
                  }`}
                >
                  <div className="font-semibold text-xs text-[#fafafa]">{item.type}</div>
                  <div className="text-[11px] text-[#71717a] mt-1">{item.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-[#27272a]">
              <button onClick={() => setStep(0)} className="px-4 py-2 text-xs text-[#71717a] hover:text-[#fafafa]">Back</button>
              <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded transition-all flex items-center gap-1.5">
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: COMPANY INFORMATION */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-indigo-400 uppercase">STEP 02</div>
              <h2 className="text-xl font-bold text-[#fafafa]">Company Information</h2>
              <p className="text-xs text-[#a1a1aa]">Provide core details for your AI executive team.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#71717a]">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Software Studio"
                  className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#71717a]">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#71717a]">Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="UTC-5 (EST)"
                    className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#71717a]">Working Hours</label>
                  <input
                    type="text"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="09:00 AM - 05:00 PM"
                    className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#71717a]">Default Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500"
                  >
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>CAD ($)</option>
                    <option>AUD ($)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#27272a]">
              <button onClick={() => setStep(1)} className="px-4 py-2 text-xs text-[#71717a] hover:text-[#fafafa]">Back</button>
              <button
                onClick={() => setStep(3)}
                disabled={!companyName.trim()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONNECT SERVICES */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-indigo-400 uppercase">STEP 03</div>
              <h2 className="text-xl font-bold text-[#fafafa]">Connect Services</h2>
              <p className="text-xs text-[#a1a1aa]">Toggle active integrations for your workspace.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "Gmail", icon: <Mail size={16} /> },
                { name: "GitHub", icon: <GitBranch size={16} /> },
                { name: "Stripe", icon: <CreditCard size={16} /> },
                { name: "Linear", icon: <Zap size={16} /> },
                { name: "Resend", icon: <Send size={16} /> },
                { name: "Slack", icon: <MessageSquare size={16} /> }
              ].map((srv) => {
                const isConnected = services[srv.name];
                return (
                  <button
                    key={srv.name}
                    type="button"
                    onClick={() => toggleService(srv.name)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                      isConnected
                        ? "border-emerald-500/50 bg-emerald-950/20 text-[#fafafa]"
                        : "border-[#27272a] bg-[#09090b] text-[#a1a1aa] hover:border-[#3f3f46]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-indigo-400">{srv.icon}</div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                        isConnected
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-[#18181b] text-[#71717a] border-[#27272a]"
                      }`}>
                        {isConnected ? "Connected" : "Not Connected"}
                      </span>
                    </div>
                    <div className="font-semibold text-xs">{srv.name}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-[#27272a]">
              <button onClick={() => setStep(2)} className="px-4 py-2 text-xs text-[#71717a] hover:text-[#fafafa]">Back</button>
              <button onClick={() => setStep(4)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded transition-all flex items-center gap-1.5">
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: COMPANY BRAIN */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-indigo-400 uppercase">STEP 04</div>
              <h2 className="text-xl font-bold text-[#fafafa]">Company Brain Guidelines</h2>
              <p className="text-xs text-[#a1a1aa]">Provide operating guidelines, pricing, and contract rules.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono text-[#71717a]">Shared Knowledge Memory (Markdown)</label>
              <textarea
                rows={7}
                value={brainContent}
                onChange={(e) => setBrainContent(e.target.value)}
                className="w-full p-4 rounded bg-[#09090b] border border-[#27272a] text-xs font-mono text-[#fafafa] leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-[#27272a]">
              <button onClick={() => setStep(3)} className="px-4 py-2 text-xs text-[#71717a] hover:text-[#fafafa]">Back</button>
              <button onClick={() => setStep(5)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded transition-all flex items-center gap-1.5">
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: IMPORT FIRST CLIENT */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-indigo-400 uppercase">STEP 05</div>
              <h2 className="text-xl font-bold text-[#fafafa]">Import First Client</h2>
              <p className="text-xs text-[#a1a1aa]">Add your first client profile or skip to keep workspace empty.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#71717a]">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#71717a]">Client Work Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@acmecorp.com"
                  className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#27272a]">
              <button onClick={() => setStep(4)} className="px-4 py-2 text-xs text-[#71717a] hover:text-[#fafafa]">Back</button>
              <button onClick={() => setStep(6)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded transition-all flex items-center gap-1.5">
                <span>{clientName ? "Save Client & Review" : "Skip & Review"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW & ANIMATED BUILD PROGRESS */}
        {step === 6 && (
          <div className="space-y-6">
            {!isBuilding ? (
              <>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-indigo-400 uppercase">STEP 06</div>
                  <h2 className="text-xl font-bold text-[#fafafa]">Review & Authorize</h2>
                  <p className="text-xs text-[#a1a1aa]">Confirm configuration before initializing company.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] space-y-3 text-xs">
                  <div className="flex justify-between border-b border-[#27272a] pb-2">
                    <span className="text-[#71717a]">Company Name</span>
                    <span className="font-semibold text-[#fafafa]">{companyName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#27272a] pb-2">
                    <span className="text-[#71717a]">Company Type</span>
                    <span className="text-[#fafafa]">{companyType}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#27272a] pb-2">
                    <span className="text-[#71717a]">First Client</span>
                    <span className="text-[#fafafa]">{clientName || "None (Empty Workspace)"}</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-[#27272a]">
                  <button onClick={() => setStep(5)} className="px-4 py-2 text-xs text-[#71717a] hover:text-[#fafafa]">Back</button>
                  <button
                    onClick={handleBuildCompany}
                    className="px-7 py-3 bg-[#fafafa] hover:bg-white text-[#09090b] font-bold text-xs rounded-md shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Build Company</span>
                    <Sparkles size={14} className="text-indigo-600" />
                  </button>
                </div>
              </>
            ) : (
              /* ANIMATED BUILD PROGRESS */
              <div className="py-12 space-y-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 animate-pulse">
                  <Bot size={24} />
                </div>

                <div className="space-y-2">
                  <div className="font-mono text-sm font-bold text-indigo-400 animate-pulse">
                    {[
                      "Creating Workspace...",
                      "Initializing AI Departments...",
                      "Preparing Company Brain...",
                      "Configuring Company Memory...",
                      "Ready."
                    ][buildStatusIndex]}
                  </div>
                  <p className="text-xs text-[#71717a]">Setting up isolated SQLite environment...</p>
                </div>

                <div className="w-48 h-1.5 mx-auto bg-[#18181b] rounded-full overflow-hidden border border-[#27272a]">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${((buildStatusIndex + 1) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
