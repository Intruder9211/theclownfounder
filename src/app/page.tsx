"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Play, 
  X, 
  MessageSquarePlus
} from "lucide-react";
import { ClownAiLogoMark } from "./components/ClownAiLogoMark";
import { ThemeToggle } from "@/components/ThemeToggle";

// Intersection Observer Scroll Reveal Wrapper
function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.15 });

    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Continuous Moving Starfield Loop Component
function StarfieldBackground() {
  const [starsLayer1, setStarsLayer1] = useState<Array<{ id: number; top: number; left: number; size: number; duration: number; delay: number }>>([]);
  const [starsLayer2, setStarsLayer2] = useState<Array<{ id: number; top: number; left: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const layer1 = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: Math.random() * 150 - 20,
      left: Math.random() * 130 - 15,
      size: Math.random() * 2 + 1.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4
    }));
    const layer2 = Array.from({ length: 45 }).map((_, i) => ({
      id: i + 100,
      top: Math.random() * 150 - 20,
      left: Math.random() * 130 - 15,
      size: Math.random() * 1.5 + 0.8,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5
    }));
    setStarsLayer1(layer1);
    setStarsLayer2(layer2);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ambient background glow halos */}
      <div className="ambient-light-beam -top-40 left-1/4"></div>
      <div className="ambient-light-beam top-1/2 -right-40" style={{ animationDelay: '-7s' }}></div>

      {/* Layer 1 - Faster Drift */}
      <div className="star-container-loop" style={{ '--drift-speed': '30s' } as React.CSSProperties}>
        {starsLayer1.map((star) => (
          <div
            key={star.id}
            className="star-particle"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--twinkle-duration': `${star.duration}s`,
              '--twinkle-delay': `${star.delay}s`
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Layer 2 - Slower Parallax Drift */}
      <div className="star-container-loop" style={{ '--drift-speed': '55s', animationDelay: '-12s' } as React.CSSProperties}>
        {starsLayer2.map((star) => (
          <div
            key={star.id}
            className="star-particle opacity-70"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--twinkle-duration': `${star.duration}s`,
              '--twinkle-delay': `${star.delay}s`
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

// Travelling Floating AI Robot Mascot Guide
function ScrollingFloatingMascot({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [activeSection, setActiveSection] = useState<{ id: string; label: string; icon: string }>({
    id: "problem",
    label: "AUDITING TAX",
    icon: "🔍"
  });
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollPercent(currentProgress);
      }

      const sections = [
        { id: "problem", label: "AUDITING TAX", icon: "🔍" },
        { id: "how-it-works", label: "COMPILING LOOPS", icon: "⚡" },
        { id: "team", label: "SYNCING UNITS", icon: "🤖" },
        { id: "brief", label: "MORNING BRIEF", icon: "📊" },
        { id: "walkthrough", label: "STEPPING THRU", icon: "🚀" },
        { id: "reviews", label: "VERIFYING PASS", icon: "✓" },
        { id: "trust", label: "ENCRYPTING DATA", icon: "🔒" },
        { id: "cta", label: "LAUNCH DASHBOARD", icon: "✨" }
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.6) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (scrollPercent < 12) return null;

  return (
    <div 
      className="fixed z-40 bottom-8 right-6 md:right-10 flex flex-col items-end gap-2 transition-all duration-300 pointer-events-auto group cursor-pointer"
      onClick={onOpenAuth}
    >
      {/* Floating Speech / Status Pill */}
      <div className="px-3 py-1.5 rounded-full bg-[#121215]/95 border border-[#27272a] hover:border-indigo-500/50 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center gap-2 group-hover:scale-105 transition-all">
        <span className="text-xs">{activeSection.icon}</span>
        <span className="font-mono text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
          {activeSection.label}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
      </div>

      {/* Travelling AI Robot Mascot Character Body */}
      <div className="relative w-12 h-12 rounded-xl bg-[#09090b] border-2 border-indigo-500/70 shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center justify-center animate-bot-bob overflow-hidden group-hover:border-indigo-400">
        {/* Pulsing thruster light underneath */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-indigo-400 blur-xs rounded-full animate-pulse"></div>

        {/* Visor scan beam */}
        <div className="absolute inset-x-0 h-0.5 bg-indigo-400 shadow-[0_0_8px_#6366f1] animate-laser-scan"></div>

        {/* Robot Face & Eyes */}
        <div className="flex gap-1.5 items-center z-10">
          <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_6px_#6366f1] animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"></div>
        </div>
      </div>
    </div>
  );
}

// Compact AI Scan Bot SVG Character
function MiniScanBot({ status = "ACTIVE SCAN" }: { status?: string }) {
  return (
    <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121215] border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)] animate-bot-bob">
      {/* Radar pulse ring */}
      <div className="absolute -inset-1 rounded-full border border-indigo-500/30 animate-radar-pulse pointer-events-none"></div>

      {/* SVG Robot Visor */}
      <div className="relative w-7 h-7 rounded-md bg-[#09090b] border border-indigo-400/60 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
        {/* Laser scan line */}
        <div className="absolute inset-x-0 h-0.5 bg-indigo-400 shadow-[0_0_8px_#6366f1] animate-laser-scan"></div>
        {/* Robot Visor Eye Dots */}
        <div className="flex gap-1 items-center z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
        </div>
      </div>

      {/* Status Label */}
      <span className="font-mono text-[10px] font-bold text-indigo-300 uppercase tracking-wider">{status}</span>
    </div>
  );
}

// Compact AI Code Bot Character
function MiniCodeBot() {
  return (
    <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121215] border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-bot-bob">
      {/* Satellite orbit ring */}
      <div className="absolute -inset-1.5 rounded-lg border border-dashed border-blue-400/30 animate-orbit-spin pointer-events-none"></div>

      <div className="w-7 h-7 rounded bg-[#09090b] border border-blue-400/60 flex items-center justify-center text-blue-400 font-mono text-xs shadow-inner">
        &gt;_
      </div>
      <div className="flex flex-col text-left">
        <span className="font-mono text-[9px] text-blue-400 font-bold uppercase">CODE UNIT BOT</span>
        <span className="text-[10px] text-[#fafafa] font-mono">PR #8402 Ready</span>
      </div>
    </div>
  );
}

// Compact AI Finance Bot Character
function MiniFinanceBot() {
  return (
    <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121215] border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-bot-bob">
      <div className="w-7 h-7 rounded bg-[#09090b] border border-emerald-400/60 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold shadow-inner">
        $
      </div>
      <div className="flex flex-col text-left">
        <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase">FINANCE BOT</span>
        <span className="text-[10px] text-[#fafafa] font-mono">94% Net Margin</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [activeWtStep, setActiveWtStep] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [authEmail, setAuthEmail] = useState("");
  const [authCompany, setAuthCompany] = useState("");
  const [authError, setAuthError] = useState("");
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [approvedPreview, setApprovedPreview] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("clownfounder_registered_emails");
      if (stored) {
        setRegisteredEmails(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load registered users:", e);
    }
  }, []);

  const [reviews, setReviews] = useState([
    {
      name: "Marcus Vance",
      role: "Founder, PulseSync Analytics",
      text: "I was spending 4 hours a day on scope checks and billing addendums. clownfounder’s Finance and Engineering units handle change orders in seconds. I haven’t managed a contractor in 3 months.",
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
      text: "Other AI tools feel like gimmicks with cartoon avatars. clownfounder operates like a serious executive suite. The evidence logs give me 100% confidence to approve changes.",
      metric: "99.4% Audit Pass",
      date: "Jul 19"
    }
  ]);

  const [newReview, setNewReview] = useState({ name: "", company: "", text: "" });
  const [portalRole, setPortalRole] = useState<"founder" | "client">("founder");

  const handleOpenAuth = (mode: "signup" | "signin") => {
    setAuthMode(mode);
    setAuthError("");
    setShowAuthModal(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const normalizedEmail = authEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    const isRegistered = registeredEmails.includes(normalizedEmail);

    if (authMode === "signin") {
      if (!isRegistered) {
        setAuthError("No account found for this email. New users cannot Sign In — please Sign Up first.");
        return;
      }
    } else {
      if (isRegistered) {
        setAuthError("An account with this email already exists. Returning users cannot Sign Up again — please Sign In instead.");
        return;
      }
      const updatedList = [...registeredEmails, normalizedEmail];
      setRegisteredEmails(updatedList);
      try {
        localStorage.setItem("clownfounder_registered_emails", JSON.stringify(updatedList));
      } catch (err) {
        console.error("Error saving registered user:", err);
      }
    }

    try {
      localStorage.setItem(
        "clownfounder_current_user",
        JSON.stringify({ email: normalizedEmail, company: authCompany, role: portalRole })
      );
      localStorage.setItem("clownfounder_portal_role", portalRole);
    } catch (err) {
      console.error("Error saving current user:", err);
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setShowAuthModal(false);
      if (portalRole === "client") {
        router.push("/client");
      } else {
        router.push("/dashboard");
      }
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
      body: "Live email response dispatched via Resend API. GitHub PR #8402 and Stripe Change Order recorded directly into company audit logs.",
      status: "Executed"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#fafafa] font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      {/* Continuous Starfield Loop Background */}
      <StarfieldBackground />

      {/* Travelling Floating AI Robot Mascot Guide (Section 2 to End) */}
      <ScrollingFloatingMascot onOpenAuth={() => handleOpenAuth("signup")} />

      {/* 1. SINGLE-LINE HIGH-VISIBILITY NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur-lg border-b border-[#27272a] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4 flex-nowrap">
          
          {/* Logo with Clown AI Emblem */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <ClownAiLogoMark />
            <span className="font-bold text-sm sm:text-base md:text-lg tracking-tight text-[#fafafa]">clownfounder</span>
          </Link>

          {/* Single-line Desktop Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs xl:text-sm font-medium text-[#d4d4d8] whitespace-nowrap flex-nowrap">
            <a href="#problem" className="hover:text-white transition-colors hover:scale-105">Why clownfounder</a>
            <a href="#how-it-works" className="hover:text-white transition-colors hover:scale-105">How it Works</a>
            <a href="#team" className="hover:text-white transition-colors hover:scale-105">Executive Team</a>
            <a href="#brief" className="hover:text-white transition-colors hover:scale-105">Morning Brief</a>
            <a href="#walkthrough" className="hover:text-white transition-colors hover:scale-105">Walkthrough</a>
            <a href="#reviews" className="hover:text-white transition-colors hover:scale-105">Founder Reviews</a>
            <a href="#trust" className="hover:text-white transition-colors hover:scale-105">Security</a>
          </nav>

          {/* Auth Actions (Strictly Single Line) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
            <ThemeToggle />
            <button 
              onClick={() => handleOpenAuth("signin")} 
              className="text-xs sm:text-sm font-semibold text-[#e4e4e7] hover:text-white px-3 py-2 rounded-md hover:bg-[#18181b] transition-all hover:scale-105"
            >
              Sign In
            </button>
            <button 
              onClick={() => handleOpenAuth("signup")} 
              className="text-xs sm:text-sm font-semibold bg-[#fafafa] text-[#09090b] hover:bg-white px-3.5 sm:px-4 py-2 rounded-md shadow-md hover:shadow-white/20 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <span>Sign Up Free</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-28">

        {/* 2. HERO SECTION */}
        <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto text-center space-y-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121215] border border-[#27272a] text-xs text-[#d4d4d8] font-mono shadow-inner hover:border-indigo-500/40 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AUTONOMOUS AI EXECUTIVE TEAM WITH FOUNDER-IN-THE-LOOP APPROVAL</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#fafafa] leading-[1.15] max-w-4xl mx-auto">
              One founder. An AI executive team. Infinite focus.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-base sm:text-lg text-[#a1a1aa] max-w-2xl mx-auto font-normal leading-relaxed">
              An Autonomous AI Executive Team with Founder-in-the-Loop Approval. Sales, engineering, QA, finance, and support handle complex operational workflows while you review recommendations and steer strategic decisions.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button 
                onClick={() => handleOpenAuth("signup")} 
                className="w-full sm:w-auto px-7 py-3.5 bg-[#fafafa] text-[#09090b] font-semibold text-sm rounded-md hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-white/10 hover:scale-105 active:scale-95"
              >
                <span>Sign Up & Access Dashboard</span>
                <ArrowRight size={16} />
              </button>
              <Link 
                href="/dashboard?mode=demo" 
                className="w-full sm:w-auto px-6 py-3.5 bg-[#121215] text-[#d4d4d8] border border-[#27272a] hover:text-[#fafafa] hover:border-[#3f3f46] font-semibold text-sm rounded-md transition-all flex items-center justify-center gap-2 hover:scale-105 cursor-pointer"
              >
                <Play size={14} />
                Explore Live UI Demo
              </Link>
            </div>
          </ScrollReveal>

          {/* REAL PRODUCT PREVIEW MOCKUP */}
          <ScrollReveal delay={400}>
            <div id="preview" className="mt-16 max-w-6xl mx-auto rounded-xl bg-[#121215] border border-[#27272a] overflow-hidden shadow-2xl text-left card-hover-effect">
              <div className="h-10 px-4 bg-[#09090b] border-b border-[#27272a] flex items-center justify-between text-xs text-[#71717a] font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
                  <span className="ml-2 text-[#a1a1aa]">clownfounder // Command Center v1.0</span>
                </div>
                <button onClick={() => handleOpenAuth("signin")} className="text-emerald-400 flex items-center gap-1.5 hover:underline">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Launch Full Dashboard →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px] bg-[#09090b] text-xs">
                
                <div className="md:col-span-3 border-r border-[#27272a] p-4 bg-[#121215]/40 space-y-4">
                  <div className="text-[10px] font-mono text-[#71717a] uppercase">Executive Units</div>
                  <div className="space-y-1">
                    <div className="p-2 rounded bg-[#18181b] border border-[#27272a] text-[#fafafa] font-medium flex justify-between">
                      <span>Command Overview</span>
                      <span className="text-[10px] font-mono text-[#71717a]">LIVE</span>
                    </div>
                    <div className="p-2 rounded text-[#a1a1aa] hover:bg-[#121215] transition-colors flex justify-between cursor-pointer">
                      <span>Sales & Revenue</span>
                      <span className="text-[10px] font-mono text-[#71717a]">2 pending</span>
                    </div>
                    <div className="p-2 rounded text-[#a1a1aa] hover:bg-[#121215] transition-colors flex justify-between cursor-pointer">
                      <span>Engineering & Infra</span>
                      <span className="text-[10px] font-mono text-[#71717a]">Active</span>
                    </div>
                    <div className="p-2 rounded text-[#a1a1aa] hover:bg-[#121215] transition-colors flex justify-between cursor-pointer">
                      <span>Finance & Ops</span>
                      <span className="text-[10px] font-mono text-[#71717a]">Audit OK</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 border-r border-[#27272a] p-4 space-y-3">
                  <div className="font-mono text-[10px] text-[#71717a] uppercase mb-2">Pending Proposals (1 Awaiting Action)</div>
                  <div className="p-3 rounded-lg bg-[#121215] border border-indigo-500/40 space-y-1 cursor-pointer hover:border-indigo-400 transition-colors shadow-sm">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-indigo-400 font-semibold">#proposal-1</span>
                      <span className="text-[#71717a]">Just now</span>
                    </div>
                    <div className="font-medium text-[#fafafa] line-clamp-1">Urgent: Checkout flow redesign & multi-currency Stripe webhooks</div>
                    <div className="text-[11px] text-[#a1a1aa] line-clamp-2">
                      Sarah Jenkins (Acme Corp): Multi-Currency (IN-SCOPE [DEV-104]) | Checkout Redesign (OUT-OF-SCOPE Change Order $1,200).
                    </div>
                    <div className="pt-2 border-t border-[#27272a] flex justify-between text-[10px] text-[#71717a]">
                      <span>Confidence: <strong className="text-emerald-400">98%</strong></span>
                      <span>Project Coordinator AI</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 p-5 bg-[#121215]/20 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-[#27272a] pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400">RECOMMENDATION DETAILS</span>
                        <h3 className="text-sm font-semibold text-[#fafafa]">Acme Corp Scope & Change Order</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">+$1,200 Change Order</span>
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                      Multi-Currency Stripe Webhooks tagged as IN-SCOPE (DEV-104). Checkout redesign exceeds Sprint 4 allocation ($1,200 Change Order prepared).
                    </p>
                    <div className="p-3 rounded bg-[#121215] border border-[#27272a] space-y-1 text-[10px] font-mono text-[#a1a1aa]">
                      <div>• Linear Ticket: [DEV-104] created</div>
                      <div>• Customer LTV: $148 (Stripe Connected)</div>
                      <div>• Resend Email: Drafted & ready for dispatch</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#27272a] space-y-2">
                    {!approvedPreview ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setApprovedPreview(true)} 
                          className="py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded transition-all shadow-sm hover:scale-105 active:scale-95"
                        >
                          Approve proposal-1
                        </button>
                        <button 
                          onClick={() => handleOpenAuth("signin")} 
                          className="py-2 bg-[#121215] border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] font-medium text-xs rounded hover:border-[#3f3f46]"
                        >
                          Open Full Dashboard
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-[11px] text-emerald-400 font-mono py-2 bg-emerald-500/10 rounded border border-emerald-500/20">
                        ✓ Approved proposal-1. Resend email dispatched & DEV-104 logged to audit timeline.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 3. PROBLEM SECTION WITH SCROLL ANIMATED ROBOT */}
        <section id="problem" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-5xl mx-auto px-6 space-y-16">
            
            <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-4">
                <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">The Solo Founder Reality</div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                  You started a company to build product. Not to manage operational chaos.
                </h2>
              </div>

              {/* Scroll Animated Mini Scan Robot */}
              <div className="shrink-0">
                <MiniScanBot status="OPERATIONAL AUDIT" />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScrollReveal delay={100}>
                <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3 card-hover-effect h-full">
                  <div className="w-8 h-8 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center font-mono text-xs text-[#a1a1aa]">01</div>
                  <h3 className="text-base font-semibold text-[#fafafa]">Context Switching Kills Velocity</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Toggling between Stripe, GitHub, support tickets, and email threads destroys 6 hours of deep work every day.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3 card-hover-effect h-full">
                  <div className="w-8 h-8 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center font-mono text-xs text-[#a1a1aa]">02</div>
                  <h3 className="text-base font-semibold text-[#fafafa]">Decisions Get Buried</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Important trade-offs get buried in unorganized chat logs. Weeks later, you re-examine the same pricing model.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3 card-hover-effect h-full">
                  <div className="w-8 h-8 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center font-mono text-xs text-[#a1a1aa]">03</div>
                  <h3 className="text-base font-semibold text-[#fafafa]">Management Overhead</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Hiring managers introduces meetings, hand-offs, and alignment friction. You end up managing people instead of outcomes.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={400}>
              <div className="p-8 rounded-xl bg-[#121215]/40 border border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 card-hover-effect">
                <div className="space-y-1 max-w-2xl">
                  <div className="text-xs font-mono text-[#71717a]">OPERATIONAL BENCHMARK</div>
                  <div className="text-sm text-[#fafafa] font-medium">
                    The average solo founder spends only <span className="text-indigo-400 font-semibold">18% of their time</span> on high-leverage product strategy. The remaining 82% is coordination tax.
                  </div>
                </div>
                <div className="font-mono text-xs text-[#a1a1aa] whitespace-nowrap">
                  clownfounder flips this ratio → 92% Focus
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 4. EXECUTION LOOP WITH CODE BOT */}
        <section id="how-it-works" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-5xl mx-auto px-6 space-y-16">
            <ScrollReveal className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex justify-center mb-2">
                <MiniCodeBot />
              </div>
              <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">Execution Architecture</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                From event trigger to executed outcome in seconds.
              </h2>
              <p className="text-sm text-[#a1a1aa]">
                No daily standups. No status pinging. A continuous execution loop designed for absolute clarity.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: "STEP 01", title: "Event Triggers", desc: "Webhook, client email, or alert arrives." },
                { label: "STEP 02", title: "Departments Sync", desc: "Sales, Eng, QA, Finance analyze in parallel." },
                { label: "STEP 03", title: "Recommendation", desc: "A 3-sentence proposal is drafted with evidence." },
                { label: "STEP 04", title: "Founder Approves", desc: "1-tap mobile or desktop approval.", highlight: true },
                { label: "STEP 05", title: "Work Completes", desc: "Resend email sent; PR & Stripe actions logged to timeline." }
              ].map((step, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className={`p-4 rounded-lg border ${step.highlight ? "bg-indigo-950/20 border-indigo-500/50" : "bg-[#121215] border-[#27272a]"} space-y-2 card-hover-effect h-full`}>
                    <div className="text-[10px] font-mono text-indigo-400">{step.label}</div>
                    <div className="text-xs font-semibold text-[#fafafa]">{step.title}</div>
                    <p className="text-[11px] text-[#a1a1aa] leading-normal">{step.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. EXECUTIVE TEAM WITH MINI BOTS */}
        <section id="team" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-6xl mx-auto px-6 space-y-16">
            <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-4">
                <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">No Robots. No Avatars.</div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                  Meet your autonomous business units.
                </h2>
              </div>
              <div className="shrink-0">
                <MiniFinanceBot />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Sales & Expansion", tag: "REVENUE UNIT", color: "text-emerald-400", desc: "Monitors inbound interest, drafts enterprise pricing proposals, and identifies expansion opportunities." },
                { name: "Engineering & Infra", tag: "CODE UNIT", color: "text-blue-400", desc: "Converts approved recommendations into clean pull requests. Monitors server health." },
                { name: "QA & Security Audit", tag: "AUDIT UNIT", color: "text-amber-400", desc: "Audits code changes, checks dependency vulnerabilities, and enforces security standards." },
                { name: "Finance & Operations", tag: "FINANCE UNIT", color: "text-purple-400", desc: "Manages automated invoicing, flags unused subscriptions, and models burn rate." },
                { name: "Customer Support", tag: "SUCCESS UNIT", color: "text-pink-400", desc: "Resolves 92% of customer inquiries instantly using verified product context." },
                { name: "Marketing & Growth", tag: "POSITIONING UNIT", color: "text-indigo-400", desc: "Drafts product changelogs, synthesizes user feedback, and keeps docs updated." }
              ].map((unit, idx) => (
                <ScrollReveal key={idx} delay={idx * 80}>
                  <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4 flex flex-col justify-between card-hover-effect h-full">
                    <div className="space-y-2">
                      <span className={`text-xs font-mono font-medium ${unit.color}`}>{unit.tag}</span>
                      <h3 className="text-lg font-semibold text-[#fafafa]">{unit.name}</h3>
                      <p className="text-xs text-[#a1a1aa] leading-relaxed">{unit.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. MORNING BRIEF WITH SCROLL ANIMATED BOT */}
        <section id="brief" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            <ScrollReveal className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex justify-center mb-2">
                <MiniScanBot status="OVERNIGHT EXECUTIVE BRIEF" />
              </div>
              <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">Signature Feature</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                Start your day with quiet clarity.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="rounded-xl bg-[#121215] border border-[#27272a] p-6 md:p-8 space-y-6 shadow-xl card-hover-effect">
                <div className="flex justify-between items-center border-b border-[#27272a] pb-4">
                  <div>
                    <div className="font-mono text-xs text-[#71717a]">MORNING EXECUTIVE BRIEF</div>
                    <div className="text-lg font-semibold text-[#fafafa]">Overnight Operations Summary</div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">All Units Nominal</span>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Over the last 8 hours while you slept, 24 customer tickets were triaged and resolved with a 99.1% satisfaction score. Engineering merged 4 bug fixes. Finance identified $1,400 in unutilized staging infrastructure.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 7. WALKTHROUGH WITH SCROLL ANIMATIONS */}
        <section id="walkthrough" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-5xl mx-auto px-6 space-y-16">
            <ScrollReveal className="text-center max-w-2xl mx-auto space-y-4">
              <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">End-to-End Story</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                From client email to paid invoice.
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 space-y-3">
                {stepsData.map((step, idx) => (
                  <ScrollReveal key={idx} delay={idx * 70}>
                    <button
                      onClick={() => setActiveWtStep(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${activeWtStep === idx ? "border-indigo-500 bg-[#121215] text-[#fafafa] shadow-[0_0_20px_rgba(99,102,241,0.15)]" : "border-[#27272a] bg-[#121215]/40 text-[#a1a1aa] hover:border-[#3f3f46]"}`}
                    >
                      <div className="font-mono text-[10px] text-indigo-400 mb-1">{step.num}. {step.tag}</div>
                      <div className="font-semibold text-xs mb-1">{step.title}</div>
                    </button>
                  </ScrollReveal>
                ))}
              </div>

              <div className="md:col-span-7">
                <ScrollReveal delay={200}>
                  <div className="rounded-xl bg-[#121215] border border-[#27272a] p-6 min-h-[340px] flex flex-col justify-between card-hover-effect">
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
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* 8. VERIFIED FOUNDER REVIEWS */}
        <section id="reviews" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-6xl mx-auto px-6 space-y-16">
            <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#27272a] pb-6">
              <div className="space-y-3 max-w-2xl">
                <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">Verified User Rationale</div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                  Built for founders who value outcomes over headcount.
                </h2>
              </div>
              <button 
                onClick={() => setShowReviewModal(true)} 
                className="px-4 py-2 bg-[#121215] border border-[#27272a] hover:border-indigo-500/40 text-[#fafafa] font-medium text-xs rounded-md flex items-center gap-2 transition-all hover:scale-105"
              >
                <MessageSquarePlus size={14} className="text-indigo-400" />
                Submit Product Review
              </button>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev, idx) => (
                <ScrollReveal key={idx} delay={idx * 100}>
                  <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4 flex flex-col justify-between card-hover-effect h-full">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-[#71717a]">
                        <span>VERIFIED FOUNDER</span>
                        <span className="text-emerald-400">✓ {rev.metric}</span>
                      </div>
                      <p className="text-xs text-[#a1a1aa] leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
                    </div>
                    <div className="pt-4 border-t border-[#27272a]/60 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-[#fafafa]">{rev.name}</div>
                        <div className="text-[#71717a] text-[11px]">{rev.role}</div>
                      </div>
                      <span className="font-mono text-[10px] text-[#71717a]">{rev.date}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 9. TRUST */}
        <section id="trust" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <div className="max-w-5xl mx-auto px-6 space-y-16">
            <ScrollReveal className="text-center max-w-2xl mx-auto space-y-4">
              <div className="font-mono text-xs text-indigo-400 uppercase tracking-wider">Built for Control</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa]">
                No black boxes. Absolute transparency.
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ScrollReveal delay={100}>
                <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3 card-hover-effect h-full">
                  <h3 className="text-base font-semibold text-[#fafafa]">Founder Always in Control</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Critical business actions—invoices, contract signatures, and deploys—always require your authorization.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3 card-hover-effect h-full">
                  <h3 className="text-base font-semibold text-[#fafafa]">Evidence-Based Rationale</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Every proposal links directly to code diffs, support ticket quotes, or financial calculations.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3 card-hover-effect h-full">
                  <h3 className="text-base font-semibold text-[#fafafa]">Zero Data Training</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Your business data is strictly isolated, encrypted at rest, and never used to train public models.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 10. FINAL CTA */}
        <section id="cta" className="py-24 border-t border-[#27272a]/60 bg-[#09090b]">
          <ScrollReveal className="max-w-3xl mx-auto px-6 text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#fafafa]">
              Run a company. Not a circus.
            </h2>
            <p className="text-base text-[#a1a1aa]">
              Authenticate to open your dedicated AI Executive Team dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <button 
                onClick={() => handleOpenAuth("signup")} 
                className="w-full sm:w-auto px-7 py-3 bg-[#fafafa] text-[#09090b] font-semibold text-xs rounded-md hover:bg-white/90 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-lg"
              >
                <span>Sign Up & Enter Dashboard</span>
                <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => handleOpenAuth("signin")} 
                className="w-full sm:w-auto px-6 py-3 bg-[#121215] border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-[#fafafa] font-medium text-xs rounded-md transition-all hover:scale-105"
              >
                Sign In Existing Account
              </button>
            </div>
          </ScrollReveal>
        </section>

      </main>

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl lg:w-[55vw] rounded-2xl bg-[#121215] border border-[#27272a] p-6 sm:p-8 md:p-10 space-y-6 relative shadow-2xl">
            <button 
              onClick={() => setShowAuthModal(false)} 
              className="absolute top-5 right-5 p-1.5 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-3">
              <div className="flex border-b border-[#27272a] gap-4 pb-2">
                <button
                  type="button"
                  onClick={() => { setAuthMode("signup"); setAuthError(""); }}
                  className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wider transition-all border-b-2 cursor-pointer ${
                    authMode === "signup"
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-[#71717a] hover:text-[#a1a1aa]"
                  }`}
                >
                  SIGN UP (New Users)
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("signin"); setAuthError(""); }}
                  className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wider transition-all border-b-2 cursor-pointer ${
                    authMode === "signin"
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-[#71717a] hover:text-[#a1a1aa]"
                  }`}
                >
                  SIGN IN (Returning Users)
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#fafafa] tracking-tight">
                {authMode === "signup" ? "Create Your Workspace Account" : "Welcome Back to Workspace"}
              </h3>
            </div>

            {authError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 space-y-2">
                <div>{authError}</div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "signup" ? "signin" : "signup");
                    setAuthError("");
                  }}
                  className="font-mono text-xs underline text-indigo-400 hover:text-indigo-300 block cursor-pointer"
                >
                  Switch to {authMode === "signup" ? "Sign In Mode" : "Sign Up Mode"} →
                </button>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-6">
              {/* Portal Selector */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-mono text-[#a1a1aa] uppercase tracking-wider block font-semibold">
                  Select Portal Destination
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setPortalRole("founder")}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                      portalRole === "founder"
                        ? "bg-indigo-500/10 border-indigo-500 text-[#fafafa] shadow-md"
                        : "bg-[#09090b] border-[#27272a] text-[#71717a] hover:border-[#3f3f46] hover:text-[#a1a1aa]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#fafafa] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                        <span>Founder Portal</span>
                      </span>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        /dashboard
                      </span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                      Full AI Executive Team, P&L Accounting, Company Brain & Delivery Approvals.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPortalRole("client")}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                      portalRole === "client"
                        ? "bg-emerald-500/10 border-emerald-500 text-[#fafafa] shadow-md"
                        : "bg-[#09090b] border-[#27272a] text-[#71717a] hover:border-[#3f3f46] hover:text-[#a1a1aa]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                        <span>Client Portal</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        /client
                      </span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                      Lightweight Progress Tracker, Dedicated Support AI Chat & Proposals Review.
                    </p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-mono text-[#a1a1aa]">Work Email</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder={portalRole === "client" ? "sarah@acme-corp.com" : "founder@company.com"}
                    className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-mono text-[#a1a1aa]">Company Name</label>
                  <input
                    type="text"
                    required
                    value={authCompany}
                    onChange={(e) => setAuthCompany(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating
                  ? "Authenticating Workspace..."
                  : authMode === "signup"
                  ? `Sign Up & Open ${portalRole === "client" ? "Client Portal" : "Founder Portal"}`
                  : `Sign In & Open ${portalRole === "client" ? "Client Portal" : "Founder Portal"}`}
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
      <footer className="relative z-10 border-t border-[#27272a]/60 bg-[#09090b] py-12 px-6 text-xs text-[#a1a1aa]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ClownAiLogoMark className="w-6 h-6" />
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
