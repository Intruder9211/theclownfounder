"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  CheckCircle2, 
  Play,
  X,
  MessageSquarePlus
} from "lucide-react";

export default function MarketingLandingPage() {
  const router = useRouter();
  const [activeWtStep, setActiveWtStep] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [reviews, setReviews] = useState([
    {
      name: "Marcus Vance",
      role: "Founder, PulseSync Analytics",
      text: "I was spending 4 hours a day on scope checks and billing addendums. clownfounder’s Finance and Engineering units handle change orders in seconds.",
      metric: "18h Saved / Wk",
      date: "Jul 14"
    },
    {
      name: "Elena Rostova",
      role: "Solo Creator, Kroma Studio",
      text: "The Morning Brief is my favorite part of the day. Overnight support tickets get triaged with zero hallucinated promises, and I just tap 1 button to approve code deploys.",
      metric: "$42k ARR Expansion",
      date: "Jul 18"
    },
    {
      name: "David Chen",
      role: "Founder, Layered Infrastructure",
      text: "Other AI tools feel like gimmicks with cartoon avatars. clownfounder operates like a serious executive suite. The evidence logs give me 100% confidence.",
      metric: "99.4% Audit Pass",
      date: "Jul 19"
    }
  ]);

  const [newReview, setNewReview] = useState({ name: "", company: "", text: "" });

  const handleOpenAuth = (mode: "signup" | "signin") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setShowAuthModal(false);
      router.push("/");
    }, 700);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    setReviews([
      {
        name: newReview.name,
        role: newReview.company || "Verified Founder",
        text: newReview.text,
        metric: "Verified Review",
        date: "Just now"
      },
      ...reviews
    ]);
    setShowReviewModal(false);
    setNewReview({ name: "", company: "", text: "" });
  };

  const stepsData = [
    {
      num: "01",
      title: "Inbound Client Request",
      tag: "INBOUND TRIGGER",
      body: "Client (Acme Corp) emails: 'We need custom OAuth SAML single sign-on integration by next Friday for enterprise rollout.'",
      status: "Event Received"
    },
    {
      num: "02",
      title: "Scope & Impact Calculation",
      tag: "DEPARTMENTS COLLABORATING",
      body: "Engineering checks codebase (14 hrs effort). Finance calculates margin ($4,500 quote yields 94% net margin).",
      status: "Analysis Complete"
    },
    {
      num: "03",
      title: "Change Order Generated",
      tag: "FINANCE & LEGAL UNIT",
      body: "A standard enterprise Change Order addendum is drafted automatically with 14-day SLA and milestone payment terms.",
      status: "Draft Ready"
    },
    {
      num: "04",
      title: "Founder 1-Click Approval",
      tag: "FOUNDER DECISION POINT",
      body: "Founder receives mobile notification: 'Approve $4,500 SAML Change Order for Acme Corp?' Founder taps Approve.",
      status: "Authorized"
    },
    {
      num: "05",
      title: "Execution & Settlement",
      tag: "AUTOMATED EXECUTION",
      body: "Stripe issues deposit invoice to Acme Corp. Engineering agent opens GitHub PR #8402. Client notified with timeline.",
      status: "Executed"
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* MINIMAL NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/85 backdrop-blur-md border-b border-[#27272a]/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 rounded bg-[#121215] border border-[#27272a] flex items-center justify-center group-hover:border-[#3f3f46] transition-colors">
              <span className="font-mono text-xs font-bold text-[#fafafa]">+</span>
            </div>
            <span className="font-semibold text-sm tracking-tight text-[#fafafa]">clownfounder</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#a1a1aa]">
            <a href="#problem" className="hover:text-[#fafafa] transition-colors">Why clownfounder</a>
            <a href="#how-it-works" className="hover:text-[#fafafa] transition-colors">How it Works</a>
            <a href="#team" className="hover:text-[#fafafa] transition-colors">Executive Team</a>
            <a href="#brief" className="hover:text-[#fafafa] transition-colors">Morning Brief</a>
            <a href="#walkthrough" className="hover:text-[#fafafa] transition-colors">Walkthrough</a>
            <a href="#reviews" className="hover:text-[#fafafa] transition-colors">Founder Reviews</a>
            <a href="#trust" className="hover:text-[#fafafa] transition-colors">Security</a>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => handleOpenAuth("signin")} className="text-xs font-medium text-[#a1a1aa] hover:text-[#fafafa] px-3 py-1.5 transition-colors">
              Sign In
            </button>
            <button onClick={() => handleOpenAuth("signup")} className="text-xs font-medium bg-[#121215] text-[#fafafa] border border-[#27272a] hover:border-[#3f3f46] px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5">
              <span>Sign Up Free</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24">

        {/* HERO SECTION */}
        <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121215] border border-[#27272a] text-xs text-[#a1a1aa] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AN EXECUTIVE TEAM FOR SOLO FOUNDERS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#fafafa] leading-[1.15] max-w-4xl mx-auto">
            One founder. An AI executive team. Infinite focus.
          </h1>

          <p className="text-base sm:text-lg text-[#a1a1aa] max-w-2xl mx-auto font-normal leading-relaxed">
            clownfounder replaces management overhead with outcome alignment. Sales, engineering, QA, finance, and support operate autonomously while you review recommendations and steer the company.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button onClick={() => handleOpenAuth("signup")} className="w-full sm:w-auto px-7 py-3 bg-[#fafafa] text-[#09090b] font-semibold text-sm rounded-md hover:bg-white/90 transition-all flex items-center justify-center gap-2">
              <span>Sign Up & Access Dashboard</span>
              <ArrowRight size={16} />
            </button>
            <a href="#preview" className="w-full sm:w-auto px-6 py-3 bg-[#121215] text-[#a1a1aa] border border-[#27272a] hover:text-[#fafafa] hover:border-[#3f3f46] font-medium text-sm rounded-md transition-all text-center flex items-center justify-center gap-2">
              <Play size={14} />
              Explore Live UI Demo
            </a>
          </div>

          {/* REAL PRODUCT PREVIEW */}
          <div id="preview" className="mt-16 max-w-6xl mx-auto rounded-xl bg-[#121215] border border-[#27272a] overflow-hidden shadow-2xl text-left">
            <div className="h-10 px-4 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between text-xs text-[#71717a] font-mono">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
                <span className="ml-2 text-[#a1a1aa]">clownfounder // Command Center v1.0</span>
              </div>
              <button onClick={() => handleOpenAuth("signin")} className="text-emerald-400 flex items-center gap-1.5 hover:underline">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Authenticate to Open App →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px] bg-[#09090b] text-xs">
              <div className="md:col-span-3 border-r border-[#27272a] p-4 bg-[#121215]/40 space-y-4">
                <div className="text-[10px] font-mono text-[#71717a] uppercase">Executive Units</div>
                <div className="space-y-1">
                  <div className="p-2 rounded bg-[#18181b] border border-[#27272a] text-[#fafafa] font-medium flex justify-between">
                    <span>Command Center</span>
                    <span className="text-[10px] font-mono text-[#71717a]">LIVE</span>
                  </div>
                  <div className="p-2 rounded text-[#a1a1aa] flex justify-between">
                    <span>Sales & Revenue</span>
                    <span className="text-[10px] font-mono text-[#71717a]">2 pending</span>
                  </div>
                  <div className="p-2 rounded text-[#a1a1aa] flex justify-between">
                    <span>Engineering & Infra</span>
                    <span className="text-[10px] font-mono text-[#71717a]">Active</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 border-r border-[#27272a] p-4 space-y-3">
                <div className="font-mono text-[10px] text-[#71717a] uppercase mb-2">Pending Proposals</div>
                <div className="p-3 rounded-lg bg-[#121215] border border-indigo-500/40 space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-indigo-400">#PR-8402</span>
                    <span className="text-[#71717a]">2m ago</span>
                  </div>
                  <div className="font-medium text-[#fafafa]">Approve Enterprise SSO Proposal</div>
                  <div className="text-[11px] text-[#a1a1aa] line-clamp-2">
                    Sales & Eng drafted a $4,500 SAML integration change order for Acme Corp.
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 p-5 bg-[#121215]/20 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-[#27272a] pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400">RECOMMENDATION</span>
                      <h3 className="text-sm font-semibold text-[#fafafa]">Enterprise SAML SSO</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">+$4,500 ARR</span>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                    Acme Corp requested OAuth/SAML SSO. Engineering verified Auth0 backend capacity. Sales drafted addendum.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#27272a]">
                  <button 
                    onClick={() => handleOpenAuth("signin")} 
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded transition-all flex items-center justify-center gap-1.5"
                  >
                    Sign In to Open Command Center →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section id="problem" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-5xl mx-auto px-6 space-y-16">
            <div className="max-w-2xl space-y-4">
              <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">The Solo Founder Reality</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                You started a company to build product. Not to manage operational chaos.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <div className="w-8 h-8 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center font-mono text-xs text-[#a1a1aa]">01</div>
                <h3 className="text-base font-semibold text-[#fafafa]">Context Switching Kills Velocity</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Toggling between Stripe, GitHub, support tickets, and email threads destroys 6 hours of deep work every day.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <div className="w-8 h-8 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center font-mono text-xs text-[#a1a1aa]">02</div>
                <h3 className="text-base font-semibold text-[#fafafa]">Decisions Get Buried</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Important trade-offs get buried in unorganized chat logs. Weeks later, you re-examine the same pricing model.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <div className="w-8 h-8 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center font-mono text-xs text-[#a1a1aa]">03</div>
                <h3 className="text-base font-semibold text-[#fafafa]">Management Overhead</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Hiring managers introduces meetings, hand-offs, and alignment friction. You end up managing people instead of outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EXECUTION LOOP */}
        <section id="how-it-works" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-5xl mx-auto px-6 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">Execution Architecture</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                From event trigger to executed outcome in seconds.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {["Event Triggers", "Departments Sync", "Recommendation", "Founder Approves", "Work Completes"].map((step, i) => (
                <div key={i} className={`p-4 rounded-lg border ${i === 3 ? "bg-indigo-950/20 border-indigo-500/50" : "bg-[#121215] border-[#27272a]"} space-y-2`}>
                  <div className="text-[10px] font-mono text-indigo-400">STEP 0{i + 1}</div>
                  <div className="text-xs font-semibold text-[#fafafa]">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXECUTIVE TEAM */}
        <section id="team" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-6xl mx-auto px-6 space-y-16">
            <div className="max-w-2xl space-y-4">
              <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">No Robots. No Avatars.</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                Meet your autonomous business units.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Sales & Expansion", tag: "REVENUE UNIT", color: "text-emerald-400", desc: "Monitors inbound interest, drafts enterprise pricing proposals, and identifies expansion opportunities." },
                { name: "Engineering & Infra", tag: "CODE UNIT", color: "text-blue-400", desc: "Converts approved recommendations into clean pull requests. Monitors server health." },
                { name: "QA & Security Audit", tag: "AUDIT UNIT", color: "text-amber-400", desc: "Audits code changes, checks dependency vulnerabilities, and enforces security standards." },
                { name: "Finance & Operations", tag: "FINANCE UNIT", color: "text-purple-400", desc: "Manages automated invoicing, flags unused subscriptions, and models burn rate." },
                { name: "Customer Support", tag: "SUCCESS UNIT", color: "text-pink-400", desc: "Resolves 92% of customer inquiries instantly using verified product context." },
                { name: "Marketing & Growth", tag: "POSITIONING UNIT", color: "text-indigo-400", desc: "Drafts product changelogs, synthesizes user feedback, and keeps docs updated." }
              ].map((unit, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className={`text-xs font-mono font-medium ${unit.color}`}>{unit.tag}</span>
                    <h3 className="text-lg font-semibold text-[#fafafa]">{unit.name}</h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">{unit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MORNING BRIEF */}
        <section id="brief" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">Signature Feature</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                Start your day with quiet clarity.
              </h2>
            </div>

            <div className="rounded-xl bg-[#121215] border border-[#27272a] p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-[#27272a] pb-4">
                <div>
                  <div className="font-mono text-xs text-[#71717a]">MORNING EXECUTIVE BRIEF</div>
                  <div className="text-lg font-semibold text-[#fafafa]">Overnight Operations Summary</div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">All Units Nominal</span>
              </div>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                Over the last 8 hours while you slept, 24 customer tickets were triaged and resolved with a 99.1% satisfaction score. Engineering merged 4 bug fixes. Finance identified $1,400 in unutilized staging infrastructure.
              </p>
            </div>
          </div>
        </section>

        {/* WALKTHROUGH */}
        <section id="walkthrough" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-5xl mx-auto px-6 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">End-to-End Story</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                From client email to paid invoice.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 space-y-3">
                {stepsData.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveWtStep(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${activeWtStep === idx ? "border-indigo-500 bg-[#121215] text-[#fafafa]" : "border-[#27272a] bg-[#121215]/40 text-[#a1a1aa]"}`}
                  >
                    <div className="font-mono text-[10px] text-indigo-400 mb-1">{step.num}. {step.tag}</div>
                    <div className="font-semibold text-xs mb-1">{step.title}</div>
                  </button>
                ))}
              </div>

              <div className="md:col-span-7 rounded-xl bg-[#121215] border border-[#27272a] p-6 min-h-[340px] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-indigo-400">{stepsData[activeWtStep].tag}</span>
                    <span className="text-[#71717a]">{stepsData[activeWtStep].status}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#fafafa]">{stepsData[activeWtStep].title}</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">{stepsData[activeWtStep].body}</p>
                </div>
                <div className="pt-4 border-t border-[#27272a] flex justify-between text-xs font-mono text-[#71717a]">
                  <span>STEP {activeWtStep + 1} OF 5</span>
                  <button onClick={() => setActiveWtStep((activeWtStep + 1) % 5)} className="text-indigo-400 hover:underline">Next Step →</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VERIFIED FOUNDER REVIEWS (REPLACES PRICING) */}
        <section id="reviews" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-6xl mx-auto px-6 space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#27272a] pb-6">
              <div className="space-y-3 max-w-2xl">
                <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">Verified User Rationale</div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                  Built for founders who value outcomes over headcount.
                </h2>
              </div>
              <button onClick={() => setShowReviewModal(true)} className="px-4 py-2 bg-[#121215] border border-[#27272a] hover:border-[#3f3f46] text-[#fafafa] font-medium text-xs rounded-md flex items-center gap-2">
                <MessageSquarePlus size={14} className="text-indigo-400" />
                Submit Product Review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#71717a]">
                      <span>VERIFIED FOUNDER</span>
                      <span className="text-emerald-400">✓ {rev.metric}</span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">"{rev.text}"</p>
                  </div>
                  <div className="pt-4 border-t border-[#27272a]/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#fafafa]">{rev.name}</div>
                      <div className="text-[#71717a] text-[11px]">{rev.role}</div>
                    </div>
                    <span className="font-mono text-[10px] text-[#71717a]">{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section id="trust" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-5xl mx-auto px-6 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">Built for Control</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                No black boxes. Absolute transparency.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <h3 className="text-base font-semibold text-[#fafafa]">Founder Always in Control</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Critical business actions—invoices, contract signatures, and deploys—always require your authorization.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <h3 className="text-base font-semibold text-[#fafafa]">Evidence-Based Rationale</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Every proposal links directly to code diffs, support ticket quotes, or financial calculations.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <h3 className="text-base font-semibold text-[#fafafa]">Zero Data Training</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Your business data is strictly isolated, encrypted at rest, and never used to train public models.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="cta" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#fafafa]">
              Run a company. Not a circus.
            </h2>
            <p className="text-base text-[#a1a1aa]">
              Authenticate to open your dedicated AI Executive Team dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <button onClick={() => handleOpenAuth("signup")} className="w-full sm:w-auto px-7 py-3 bg-[#fafafa] text-[#09090b] font-semibold text-xs rounded-md hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                <span>Sign Up & Enter Dashboard</span>
                <ArrowRight size={14} />
              </button>
              <button onClick={() => handleOpenAuth("signin")} className="w-full sm:w-auto px-6 py-3 bg-[#121215] border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-[#fafafa] font-medium text-xs rounded-md transition-all">
                Sign In Existing Account
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-[#121215] border border-[#27272a] p-6 md:p-8 space-y-6 relative shadow-2xl">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-[#71717a] hover:text-[#fafafa]">
              <X size={16} />
            </button>

            <div className="space-y-1">
              <div className="text-[10px] font-mono text-indigo-400 uppercase">
                {authMode === "signup" ? "FREE SIGN UP" : "AUTHENTICATION"}
              </div>
              <h3 className="text-lg font-bold text-[#fafafa]">
                {authMode === "signup" ? "Create Founder Account" : "Enter Founder Workspace"}
              </h3>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-mono text-[#71717a]">Work Email</label>
                <input type="email" required placeholder="founder@company.com" className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-mono text-[#71717a]">Company Name</label>
                <input type="text" required placeholder="Acme Corp" className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500" />
              </div>

              <button type="submit" disabled={isAuthenticating} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded transition-all flex items-center justify-center gap-2">
                {isAuthenticating ? "Authenticating Workspace..." : "Authenticate & Open Dashboard"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-[#121215] border border-[#27272a] p-6 md:p-8 space-y-6 relative shadow-2xl">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-[#71717a] hover:text-[#fafafa]">
              <X size={16} />
            </button>

            <div className="space-y-1">
              <div className="text-[10px] font-mono text-indigo-400 uppercase">VERIFIED REVIEW</div>
              <h3 className="text-lg font-bold text-[#fafafa]">Submit Founder Review</h3>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-mono text-[#71717a]">Your Name</label>
                <input type="text" required value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} placeholder="Alex Rivera" className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-mono text-[#71717a]">Company / Role</label>
                <input type="text" required value={newReview.company} onChange={(e) => setNewReview({ ...newReview, company: e.target.value })} placeholder="Founder, CloudScale" className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-mono text-[#71717a]">Review / Impact</label>
                <textarea required rows={3} value={newReview.text} onChange={(e) => setNewReview({ ...newReview, text: e.target.value })} placeholder="Explain your experience..." className="w-full px-4 py-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500"></textarea>
              </div>

              <button type="submit" className="w-full py-3 bg-[#fafafa] text-[#09090b] font-semibold text-xs rounded hover:bg-white/90 transition-all">
                Publish Review to Landing Page
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#27272a]/60 bg-[#09090b] py-12 px-6 text-xs text-[#a1a1aa]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#fafafa]">clownfounder</span>
            <span className="text-[#71717a]">•</span>
            <span className="text-[#71717a]">The Free AI Executive Team</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px] text-[#71717a]">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Systems Operational
            </span>
            <a href="#trust" className="hover:text-[#a1a1aa]">Privacy</a>
            <a href="#trust" className="hover:text-[#a1a1aa]">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
