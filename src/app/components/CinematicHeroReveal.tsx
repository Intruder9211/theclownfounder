"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function CinematicHeroReveal({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<number>(0); // 0: Dark, 1: Letter Rise, 2: Light Sweep & Orbit, 3: UI Fragments, 4: Settle Tagline

  useEffect(() => {
    // 6-Second Timeline Sequence
    const timer1 = setTimeout(() => setStage(1), 1000); // 1s: Letters emerge
    const timer2 = setTimeout(() => setStage(2), 2200); // 2.2s: Light sheen & orbit
    const timer3 = setTimeout(() => setStage(3), 4000); // 4s: Soft UI fragments reveal
    const timer4 = setTimeout(() => setStage(4), 5200); // 5.2s: Tagline & settle

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Ambient Dust Particles & Soft Volumetric Light Beam Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // 40 Floating micro dust particles
    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -Math.random() * 0.3 - 0.1,
    }));

    let beamAngle = -Math.PI / 4;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Soft Studio Ambient Gradient
      const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
      bgGradient.addColorStop(0, "rgba(24, 24, 27, 0.4)");
      bgGradient.addColorStop(0.5, "rgba(13, 13, 13, 0.95)");
      bgGradient.addColorStop(1, "#09090b");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Sweeping Light Beam
      beamAngle += 0.005;
      const beamX = width / 2 + Math.cos(beamAngle) * (width * 0.35);
      const beamGradient = ctx.createRadialGradient(beamX, height / 2, 10, beamX, height / 2, 280);
      beamGradient.addColorStop(0, "rgba(255, 255, 255, 0.07)");
      beamGradient.addColorStop(0.4, "rgba(99, 102, 241, 0.03)");
      beamGradient.addColorStop(1, "transparent");
      ctx.fillStyle = beamGradient;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Floating Dust Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 250, 250, ${p.alpha})`;
        ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const logoLetters = "clownfounder".split("");

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] bg-[#09090b] rounded-2xl border border-[#27272a]/80 overflow-hidden flex flex-col items-center justify-center select-none shadow-2xl">
      
      {/* Background Canvas for Dust & Volumetric Studio Lighting */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Subtle Ribbon Light Ray behind logo */}
      <div 
        className={`absolute w-[700px] h-[300px] bg-gradient-to-r from-indigo-500/10 via-white/5 to-emerald-500/10 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${
          stage >= 2 ? "opacity-100 scale-100 rotate-12" : "opacity-0 scale-75"
        }`}
      />

      {/* STAGE 4: Soft Blurred Minimal UI Fragments in Background */}
      <div 
        className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-all duration-1000 ${
          stage >= 3 ? "opacity-40 blur-[3px] scale-100" : "opacity-0 blur-xl scale-95"
        }`}
      >
        <div className="w-full max-w-4xl px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left font-sans">
          
          <div className="p-3.5 rounded-lg bg-[#121215]/80 border border-[#27272a] space-y-1 shadow-lg">
            <div className="text-[9px] font-mono text-[#71717a] uppercase">MORNING BRIEF</div>
            <div className="text-xs font-semibold text-[#fafafa]">Overnight Triage</div>
            <div className="text-[10px] text-emerald-400 font-mono">99.1% Pass Rate</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#121215]/80 border border-[#27272a] space-y-1 shadow-lg">
            <div className="text-[9px] font-mono text-indigo-400 uppercase">EXECUTIVE SUMMARY</div>
            <div className="text-xs font-semibold text-[#fafafa]">Scope Approved</div>
            <div className="text-[10px] text-[#a1a1aa] font-mono">SAML SSO Addendum</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#121215]/80 border border-[#27272a] space-y-1 shadow-lg">
            <div className="text-[9px] font-mono text-emerald-400 uppercase">REVENUE OPPORTUNITY</div>
            <div className="text-xs font-semibold text-[#fafafa]">+$4,500 Expansion</div>
            <div className="text-[10px] text-[#a1a1aa] font-mono">94% Net Margin</div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#121215]/80 border border-[#27272a] space-y-1 shadow-lg">
            <div className="text-[9px] font-mono text-[#71717a] uppercase">PROJECT COMPLETED</div>
            <div className="text-xs font-semibold text-[#fafafa]">PR #8402 Deployed</div>
            <div className="text-[10px] text-[#a1a1aa] font-mono">Verified by Audit</div>
          </div>

        </div>
      </div>

      {/* MAIN SUBJECT: 3D Typography "clownfounder" in Ultra-Premium Brushed Metal */}
      <div className="relative z-20 flex items-center justify-center tracking-tight px-4">
        {logoLetters.map((char, index) => (
          <span
            key={index}
            className={`inline-block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold transition-all duration-1000 ease-out transform ${
              stage >= 1 
                ? "opacity-100 translate-y-0 scale-100" 
                : "opacity-0 translate-y-12 scale-90"
            }`}
            style={{
              transitionDelay: `${index * 60 + 200}ms`,
              background: "linear-gradient(135deg, #ffffff 0%, #d4d4d8 35%, #71717a 70%, #3f3f46 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.9))",
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* STAGE 4: Minimal Settle Tagline */}
      <div 
        className={`relative z-20 mt-6 transition-all duration-1000 ease-out ${
          stage >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="h-[1px] w-24 mx-auto mb-5 bg-gradient-to-r from-transparent via-[#3f3f46] to-transparent"></div>
        <p className="text-xs sm:text-sm md:text-base font-mono font-medium text-[#d4d4d8] tracking-[0.2em] uppercase">
          The AI Executive Team for Solo Founders
        </p>
      </div>

      {/* Replay Control Button */}
      <button 
        onClick={() => {
          setStage(0);
          setTimeout(() => setStage(1), 300);
          setTimeout(() => setStage(2), 1500);
          setTimeout(() => setStage(3), 3200);
          setTimeout(() => setStage(4), 4400);
        }}
        className="absolute bottom-6 right-6 z-30 p-2 rounded-full bg-[#121215]/80 border border-[#27272a] text-[#71717a] hover:text-white transition-all hover:scale-110"
        title="Replay Cinematic Reveal"
      >
        <RotateCcw size={14} />
      </button>

    </div>
  );
}
