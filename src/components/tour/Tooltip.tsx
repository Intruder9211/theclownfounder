"use client";

import React, { useEffect, useState } from "react";
import { TourStepConfig } from "./tourConfig";
import { ArrowLeft, ArrowRight, X, CheckCircle2 } from "lucide-react";

interface TooltipProps {
  step: TourStepConfig;
  stepIndex: number;
  totalSteps: number;
  isOpen: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onDismissPermanently: () => void;
}

export function Tooltip({
  step,
  stepIndex,
  totalSteps,
  isOpen,
  onNext,
  onPrev,
  onSkip,
  onDismissPermanently
}: TooltipProps) {
  const [coords, setCoords] = useState<{ top: number; left: number; placement: string }>({
    top: 100,
    left: 100,
    placement: "bottom"
  });

  useEffect(() => {
    if (!isOpen || !step) return;

    const updatePosition = () => {
      const el = document.querySelector(step.targetSelector);
      const tooltipWidth = 350;
      const tooltipHeight = 220;

      if (!el) {
        // Fallback to center if element not present
        setCoords({
          top: Math.max(20, window.innerHeight / 2 - tooltipHeight / 2),
          left: Math.max(20, window.innerWidth / 2 - tooltipWidth / 2),
          placement: "center"
        });
        return;
      }

      const rect = el.getBoundingClientRect();
      let top = 0;
      let left = 0;
      let placement = step.placement || "bottom";

      const margin = 14;

      if (placement === "right") {
        left = rect.right + margin;
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        if (left + tooltipWidth > window.innerWidth - 20) {
          placement = "left";
          left = rect.left - tooltipWidth - margin;
        }
      } else if (placement === "left") {
        left = rect.left - tooltipWidth - margin;
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        if (left < 20) {
          placement = "bottom";
          top = rect.bottom + margin;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
        }
      } else if (placement === "top") {
        top = rect.top - tooltipHeight - margin;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        if (top < 20) {
          placement = "bottom";
          top = rect.bottom + margin;
        }
      } else {
        // Default bottom
        top = rect.bottom + margin;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        if (top + tooltipHeight > window.innerHeight - 20) {
          placement = "top";
          top = rect.top - tooltipHeight - margin;
        }
      }

      // Constrain within viewport bounds
      left = Math.max(20, Math.min(left, window.innerWidth - tooltipWidth - 20));
      top = Math.max(20, Math.min(top, window.innerHeight - tooltipHeight - 20));

      setCoords({ top, left, placement });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    const timer = setTimeout(updatePosition, 120);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      clearTimeout(timer);
    };
  }, [step, isOpen]);

  if (!isOpen || !step) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <div
      role="dialog"
      aria-label={step.title}
      className="fixed z-50 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: "350px"
      }}
    >
      <div className="relative p-5 rounded-xl bg-[#121215]/95 border border-[#27272a] shadow-2xl shadow-indigo-950/40 backdrop-blur-md text-[#fafafa] flex flex-col justify-between gap-4 font-sans text-xs">
        {/* Directional Arrow Pointer */}
        {coords.placement === "bottom" && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#121215] border-t border-l border-[#27272a] rotate-45"></div>
        )}
        {coords.placement === "top" && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#121215] border-b border-r border-[#27272a] rotate-45"></div>
        )}
        {coords.placement === "right" && (
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#121215] border-b border-l border-[#27272a] rotate-45"></div>
        )}
        {coords.placement === "left" && (
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#121215] border-t border-r border-[#27272a] rotate-45"></div>
        )}

        {/* Card Header & Badge */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {step.badge}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#71717a]">
                {stepIndex + 1} / {totalSteps}
              </span>
              <button
                onClick={onSkip}
                className="text-[#71717a] hover:text-[#fafafa] transition-colors p-1 rounded hover:bg-[#18181b]"
                title="Close tour"
                aria-label="Close tour"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-[#fafafa] leading-snug tracking-tight">
            {step.title}
          </h3>
        </div>

        {/* Content Body */}
        <p className="text-[#a1a1aa] leading-relaxed text-[11px]">
          {step.content}
        </p>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-[#27272a] flex items-center justify-between gap-2">
          <button
            onClick={onDismissPermanently}
            className="text-[10px] text-[#71717a] hover:text-red-400 transition-colors font-mono hover:underline"
            title="Don't show tour again"
          >
            Don't show again
          </button>

          <div className="flex items-center gap-1.5">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="px-2.5 py-1.5 rounded-md bg-[#18181b] hover:bg-[#27272a] text-[#d4d4d8] font-medium text-[11px] transition-all flex items-center gap-1 border border-[#27272a]"
                title="Previous step (Left Arrow)"
              >
                <ArrowLeft size={12} />
                <span>Prev</span>
              </button>
            )}

            <button
              onClick={onNext}
              className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition-all flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              title={isLast ? "Finish tour" : "Next step (Enter / Right Arrow)"}
            >
              {isLast ? (
                <>
                  <span>Finish</span>
                  <CheckCircle2 size={12} />
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight size={12} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
