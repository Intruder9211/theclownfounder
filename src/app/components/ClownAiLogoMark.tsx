import React from "react";

export function ClownAiLogoMark({ className = "w-8 h-8 md:w-9 md:h-9" }: { className?: string }) {
  return (
    <div className={`relative rounded-lg bg-[#121215] border border-[#27272a] group-hover:border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.25)] flex items-center justify-center transition-all overflow-hidden shrink-0 ${className}`}>
      {/* Background glow gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-transparent to-emerald-500/10 opacity-70 pointer-events-none"></div>

      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        <defs>
          <linearGradient id="clownAiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Minimalist Geometric Crown Spark */}
        <path d="M12 2.5L14 6L12 5L10 6L12 2.5Z" fill="url(#clownAiGrad)" />

        {/* AI Neural Eye Nodes */}
        <circle cx="8" cy="10" r="2" fill="#818cf8" />
        <circle cx="16" cy="10" r="2" fill="#10b981" />

        {/* Iconic Clown AI Smile Arc */}
        <path 
          d="M6.5 15C8 18.5 16 18.5 17.5 15" 
          stroke="url(#clownAiGrad)" 
          strokeWidth="2.2" 
          strokeLinecap="round"
        />

        {/* Subtle Cheek Accents */}
        <circle cx="5" cy="14" r="1" fill="rgba(99,102,241,0.5)" />
        <circle cx="19" cy="14" r="1" fill="rgba(16,185,129,0.5)" />
      </svg>
    </div>
  );
}
