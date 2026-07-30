import React, { useState, useRef } from "react";
import { Inbox, Brain, Settings, ShieldCheck, Cpu, BarChart3, Video, Maximize2, Minimize2, Users } from "lucide-react";
import { ClownAiLogoMark } from "@/app/components/ClownAiLogoMark";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  pendingCount: number;
  agents: any[];
}

export function Sidebar({ currentTab, setTab, pendingCount, agents }: SidebarProps) {
  const [width, setWidth] = useState<number>(240);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isExpanded = width > 300;
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(240);

  // Toggle between Normal (240px) and Double (420px) on Double Tap / Double Click
  const handleDoubleTap = () => {
    setWidth((prev) => (prev > 300 ? 240 : 420));
  };

  // Horizontal Drag to Resize (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startXRef.current;
      const newWidth = Math.min(Math.max(startWidthRef.current + deltaX, 200), 480);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    startWidthRef.current = width;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const deltaX = moveEvent.touches[0].clientX - startXRef.current;
      const newWidth = Math.min(Math.max(startWidthRef.current + deltaX, 200), 480);
      setWidth(newWidth);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Horizontal Scroll Wheel to Resize
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 5) {
      e.preventDefault();
      setWidth((prev) => Math.min(Math.max(prev + e.deltaX * 0.5, 200), 480));
    }
  };

  return (
    <>
      <aside 
        className="sidebar relative group select-none" 
        style={{ width: `${width}px`, transition: isDragging ? "none" : "width 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
        onWheel={handleWheel}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1, overflowY: "auto", minHeight: 0, paddingRight: "4px" }}>
          
          {/* Logo & Tagline Header (Double Click / Double Tap to Toggle Double Width) */}
          <div 
            id="tour-logo-header"
          onDoubleClick={handleDoubleTap}
          title="Double tap / double click to toggle double width"
          style={{ display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "4px", cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ClownAiLogoMark className="w-7 h-7" />
              <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.02em", color: "hsl(var(--text-primary))" }}>
                clownfounder
              </span>
              <span style={{ fontSize: "9px", fontWeight: 600, padding: "1px 5px", borderRadius: "4px", backgroundColor: "hsl(var(--accent-glow))", color: "hsl(var(--accent))" }}>
                {isExpanded ? "WIDE MODE" : "AI TEAM"}
              </span>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); handleDoubleTap(); }}
              style={{ background: "transparent", border: "none", color: "hsl(var(--text-dim))", cursor: "pointer", padding: "2px" }}
              title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar (Double Width)"}
            >
              {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          </div>

          <span style={{ fontSize: "11px", color: "hsl(var(--text-muted))", fontWeight: 400 }}>
            AI Project Coordinator & Scope Guard
          </span>
          <span style={{ fontSize: "9px", color: "hsl(var(--success))", fontWeight: 600, marginTop: "2px" }}>
            🛡️ COMPOUNDING MOAT SYSTEM ACTIVE ({width}px)
          </span>
        </div>

        {/* Primary Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <button
            id="tour-dashboard-tab"
            onClick={() => setTab("dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: currentTab === "dashboard" ? "hsl(var(--bg-elevated))" : "transparent",
              color: currentTab === "dashboard" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
              cursor: "pointer",
              fontSize: "13px",
              border: "none",
              textAlign: "left"
            }}
          >
            <BarChart3 size={16} style={{ color: currentTab === "dashboard" ? "hsl(var(--accent))" : "hsl(var(--text-dim))" }} />
            <span>Morning Brief</span>
          </button>

          <button
            id="tour-inbox-tab"
            onClick={() => setTab("inbox")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: currentTab === "inbox" ? "hsl(var(--bg-elevated))" : "transparent",
              color: currentTab === "inbox" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
              cursor: "pointer",
              fontSize: "13px",
              border: "none",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Inbox size={16} style={{ color: currentTab === "inbox" ? "hsl(var(--accent))" : "hsl(var(--text-dim))" }} />
              <span>Pending Proposals</span>
            </div>
            {pendingCount > 0 && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "1px 6px",
                  borderRadius: "10px",
                  backgroundColor: "hsl(var(--accent))",
                  color: "#ffffff"
                }}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            id="tour-clients-tab"
            onClick={() => setTab("clients")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: currentTab === "clients" ? "hsl(var(--bg-elevated))" : "transparent",
              color: currentTab === "clients" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
              cursor: "pointer",
              fontSize: "13px",
              border: "none",
              textAlign: "left"
            }}
          >
            <Users size={16} style={{ color: currentTab === "clients" ? "hsl(var(--accent))" : "hsl(var(--text-dim))" }} />
            <span>Clients Database</span>
          </button>

          <button
            id="tour-meetings-tab"
            onClick={() => setTab("meeting")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: currentTab === "meeting" ? "hsl(var(--bg-elevated))" : "transparent",
              color: currentTab === "meeting" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
              cursor: "pointer",
              fontSize: "13px",
              border: "none",
              textAlign: "left"
            }}
          >
            <Video size={16} style={{ color: currentTab === "meeting" ? "hsl(var(--accent))" : "hsl(var(--text-dim))" }} />
            <span>Meeting Room</span>
          </button>

          <button
            id="tour-brain-tab"
            onClick={() => setTab("brain")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: currentTab === "brain" ? "hsl(var(--bg-elevated))" : "transparent",
              color: currentTab === "brain" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
              cursor: "pointer",
              fontSize: "13px",
              border: "none",
              textAlign: "left"
            }}
          >
            <Brain size={16} style={{ color: currentTab === "brain" ? "hsl(var(--accent))" : "hsl(var(--text-dim))" }} />
            <span>Company Brain</span>
          </button>
        </nav>

        {/* Autonomous Agents Unit Section */}
        <div id="tour-agents-section" style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "hsl(var(--text-dim))",
              textTransform: "uppercase",
              paddingLeft: "4px"
            }}
          >
            Executive AI Units
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {agents.map((agent) => {
              const isSelected = currentTab === `agent_${agent.id}`;
              return (
                <button
                  key={agent.id}
                  onClick={() => setTab(`agent_${agent.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    backgroundColor: isSelected ? "hsl(var(--bg-elevated))" : "transparent",
                    color: isSelected ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
                    cursor: "pointer",
                    fontSize: "12px",
                    border: "none",
                    textAlign: "left"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Cpu size={14} style={{ color: isSelected ? "hsl(var(--accent))" : "hsl(var(--text-dim))" }} />
                    <span>{agent.name}</span>
                  </div>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: agent.isActive ? "hsl(var(--success))" : "hsl(var(--text-dim))"
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div
        style={{
          borderTop: "1px solid hsl(var(--border-muted))",
          paddingTop: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        <button
          id="tour-settings-tab"
          onClick={() => setTab("settings")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            padding: "6px 12px",
            borderRadius: "6px",
            backgroundColor: currentTab === "settings" ? "hsl(var(--bg-elevated))" : "transparent",
            color: currentTab === "settings" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
            cursor: "pointer",
            fontSize: "12px",
            border: "none",
            textAlign: "left"
          }}
        >
          <Settings size={14} style={{ color: currentTab === "settings" ? "hsl(var(--accent))" : "hsl(var(--text-dim))" }} />
          <span>System Settings</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "12px" }}>
          <ShieldCheck size={12} style={{ color: "hsl(var(--success))" }} />
          <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>Local SQLite Sandbox</span>
        </div>
      </div>

      {/* Draggable / Scrollable Resize Border Handle (Right Edge) */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleDoubleTap}
        title="Drag left/right or double click/tap to toggle width"
        style={{
          position: "absolute",
          top: 0,
          right: -4,
          bottom: 0,
          width: "8px",
          cursor: "col-resize",
          zIndex: 50
        }}
        className="hover:bg-indigo-500/30 transition-colors"
      />
    </aside>
    </>
  );
}
