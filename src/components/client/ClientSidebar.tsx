"use client";

import React from "react";
import { 
  Home, 
  Briefcase, 
  FileCheck2, 
  MessageSquare, 
  FolderDown, 
  Clock, 
  User, 
  LogOut,
  ShieldCheck
} from "lucide-react";
import { ClownAiLogoMark } from "@/app/components/ClownAiLogoMark";

interface ClientSidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  clientEmail: string;
  clientCompany?: string;
  onSignOut: () => void;
}

export function ClientSidebar({ currentTab, setTab, clientEmail, clientCompany, onSignOut }: ClientSidebarProps) {
  const navItems = [
    { id: "home", label: "Home", icon: <Home size={15} /> },
    { id: "projects", label: "Projects", icon: <Briefcase size={15} /> },
    { id: "proposals", label: "Proposals", icon: <FileCheck2 size={15} /> },
    { id: "support", label: "Support Chat", icon: <MessageSquare size={15} /> },
    { id: "files", label: "Files", icon: <FolderDown size={15} /> },
    { id: "timeline", label: "Timeline", icon: <Clock size={15} /> },
    { id: "profile", label: "Profile", icon: <User size={15} /> },
  ];

  return (
    <aside className="w-60 bg-[#09090b] border-r border-[#27272a] flex flex-col justify-between p-4 select-none shrink-0 font-sans text-xs text-[#fafafa]">
      
      {/* Top Section */}
      <div className="space-y-6">
        
        {/* Header Logo */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <ClownAiLogoMark className="w-6 h-6" />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#fafafa]">clownfounder</span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wide">
              CLIENT PORTAL
            </span>
          </div>
        </div>

        {/* Client Profile Badge */}
        <div className="p-3 rounded-lg bg-[#121215] border border-[#27272a] space-y-1">
          <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider block">Connected Account</span>
          <span className="font-semibold text-xs text-[#fafafa] block truncate">
            {clientCompany || "Client Workspace"}
          </span>
          <span className="text-[11px] text-[#a1a1aa] block truncate">{clientEmail}</span>
        </div>

        {/* Small Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#18181b] text-[#fafafa] border border-[#27272a] shadow-xs"
                    : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#121215]"
                }`}
              >
                <span className={isActive ? "text-emerald-400" : "text-[#71717a]"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System & Sign Out */}
      <div className="pt-4 border-t border-[#27272a] space-y-3">
        <div className="flex items-center gap-2 text-[10px] text-[#71717a] px-2">
          <ShieldCheck size={12} className="text-emerald-400" />
          <span>Encrypted Client Channel</span>
        </div>

        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-[#121215] hover:bg-red-500/10 text-[#a1a1aa] hover:text-red-400 border border-[#27272a] hover:border-red-500/30 transition-all text-xs font-medium cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out Portal</span>
        </button>
      </div>

    </aside>
  );
}
