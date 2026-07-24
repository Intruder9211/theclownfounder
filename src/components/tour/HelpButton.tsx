"use client";

import React from "react";
import { HelpCircle } from "lucide-react";

interface HelpButtonProps {
  sectionId: string;
  onClick: (sectionId: string) => void;
  className?: string;
}

export function HelpButton({ sectionId, onClick, className = "" }: HelpButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(sectionId);
      }}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#18181b] border border-[#27272a] text-[#71717a] hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all cursor-pointer shadow-xs ${className}`}
      title="Click to view explanation for this section"
      aria-label="Section explanation help"
    >
      <HelpCircle size={12} />
    </button>
  );
}
