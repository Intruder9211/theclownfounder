"use client";

import React, { useEffect, useState } from "react";

interface SpotlightOverlayProps {
  targetSelector: string;
  isOpen: boolean;
  padding?: number;
}

interface RectState {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function SpotlightOverlay({ targetSelector, isOpen, padding = 8 }: SpotlightOverlayProps) {
  const [rect, setRect] = useState<RectState | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(targetSelector);
      if (el) {
        const bounds = el.getBoundingClientRect();
        setRect({
          top: bounds.top - padding,
          left: bounds.left - padding,
          width: bounds.width + padding * 2,
          height: bounds.height + padding * 2
        });

        // Ensure element is visible in scroll area
        bounds.top < 0 || bounds.bottom > window.innerHeight && el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        setRect(null);
      }
    };

    updateRect();

    // Listen for window resize, scroll, and animation frames
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    const timer = setTimeout(updateRect, 100);
    const interval = setInterval(updateRect, 400);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [targetSelector, isOpen, padding]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-300">
      {/* Background SVG Cutout Mask */}
      <svg className="w-full h-full absolute inset-0">
        <defs>
          <mask id="tour-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left}
                y={rect.top}
                width={rect.width}
                height={rect.height}
                rx={10}
                ry={10}
                fill="black"
                className="transition-all duration-300 ease-out"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.65)"
          mask="url(#tour-spotlight-mask)"
          className="transition-all duration-300"
        />
      </svg>

      {/* Highlight Box Ring & Pulsing Glow Border */}
      {rect && (
        <div
          className="absolute rounded-xl pointer-events-none transition-all duration-300 ease-out border-2 border-indigo-500/80 shadow-[0_0_30px_rgba(99,102,241,0.4)]"
          style={{
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`
          }}
        >
          {/* Subtle Corner Accents */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-indigo-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400"></div>
        </div>
      )}
    </div>
  );
}
