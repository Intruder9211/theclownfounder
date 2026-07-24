import React, { useState, useEffect, useRef } from "react";
import { Inbox, Brain, Settings, Sparkles, Search } from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  setTab: (tab: "inbox" | "brain" | "settings") => void;
  onTriggerMock: (template: string) => void;
}

export function CommandBar({ isOpen, onClose, setTab, onTriggerMock }: CommandBarProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const items: CommandItem[] = [
    {
      id: "go-inbox",
      label: "Go to Inbox",
      category: "Navigation",
      icon: <Inbox size={14} />,
      action: () => {
        setTab("inbox");
        onClose();
      }
    },
    {
      id: "go-brain",
      label: "Go to Brain / Context Manager",
      category: "Navigation",
      icon: <Brain size={14} />,
      action: () => {
        setTab("brain");
        onClose();
      }
    },
    {
      id: "go-settings",
      label: "Go to Settings",
      category: "Navigation",
      icon: <Settings size={14} />,
      action: () => {
        setTab("settings");
        onClose();
      }
    },
    {
      id: "mock-refund",
      label: "Simulate Webhook: Refund Request (Alice)",
      category: "Simulations",
      icon: <Sparkles size={14} />,
      action: () => {
        onTriggerMock("refund");
        setTab("inbox");
        onClose();
      }
    },
    {
      id: "mock-invoice",
      label: "Simulate Webhook: Corporate Invoice (Bob)",
      category: "Simulations",
      icon: <Sparkles size={14} />,
      action: () => {
        onTriggerMock("invoice");
        setTab("inbox");
        onClose();
      }
    },
    {
      id: "mock-domain",
      label: "Simulate Webhook: CNAME SSL Error (Charlie)",
      category: "Simulations",
      icon: <Sparkles size={14} />,
      action: () => {
        onTriggerMock("custom_domain");
        setTab("inbox");
        onClose();
      }
    }
  ];

  // Filter commands by search term
  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Keyboard navigation inside input list
  useEffect(() => {
    if (!isOpen) return;

    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeys);
    return () => {
      window.removeEventListener("keydown", handleKeys);
    };
  }, [filtered, selectedIndex, onClose, isOpen]);

  // If search filter narrows down the list, auto-reset selection index
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        paddingTop: "15vh",
        zIndex: 1000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "540px",
          height: "fit-content",
          maxHeight: "360px",
          backgroundColor: "hsl(var(--bg-surface))",
          border: "1px solid hsl(var(--border-muted))",
          borderRadius: "8px",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Search header input */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid hsl(var(--border-muted))",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <Search size={16} style={{ color: "hsl(var(--text-dim))" }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "none",
              color: "hsl(var(--text-primary))",
              fontSize: "13px",
              fontFamily: "inherit"
            }}
          />
          <span style={{ fontSize: "10px", color: "hsl(var(--text-dim))", border: "1px solid hsl(var(--border-muted))", padding: "1px 4px", borderRadius: "3px" }}>
            ESC
          </span>
        </div>

        {/* Dynamic results feed */}
        <div style={{ padding: "8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "16px", color: "hsl(var(--text-dim))", textAlign: "center", fontSize: "12px" }}>
              No commands found
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "hsl(var(--bg-elevated))" : "transparent",
                    color: isSelected ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))",
                    transition: "background-color 0.15s ease, color 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px" }}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span style={{ fontSize: "10px", color: "hsl(var(--text-dim))", textTransform: "capitalize" }}>
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
