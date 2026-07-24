"use client";

import React, { useState } from "react";
import { User, Building, Mail, Phone, Globe, Lock, Bell, Check } from "lucide-react";
import { updateClientProfileDetails } from "@/app/actions";

interface ClientProfileViewProps {
  client: any;
  clientEmail: string;
  onRefresh: () => void;
}

export function ClientProfileView({ client, clientEmail, onRefresh }: ClientProfileViewProps) {
  const [name, setName] = useState(client ? client.name : "Client Contact");
  const [company, setCompany] = useState(client ? client.company || "Company Partner" : "Company Partner");
  const [phone, setPhone] = useState(client ? client.phone || "" : "");
  const [website, setWebsite] = useState(client ? client.website || "" : "");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [proposalAlerts, setProposalAlerts] = useState(true);
  const [password, setPassword] = useState("••••••••••••");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");

    try {
      await updateClientProfileDetails(clientEmail, {
        name,
        phone,
        website
      });
      setIsSaving(false);
      setSuccessMsg("Profile details updated successfully!");
      onRefresh();
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs text-[#fafafa] max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 rounded-xl bg-[#121215] border border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold font-mono">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-bold text-[#fafafa]">{company}</h2>
            <p className="text-xs text-[#a1a1aa]">{clientEmail}</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
          <Check size={15} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-5">
        <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <User size={14} />
          <span>Contact & Company Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#a1a1aa]">Contact Person Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#a1a1aa]">Company Name</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#a1a1aa]">Phone Number</label>
            <input
              type="text"
              placeholder="+1 (555) 234-5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#a1a1aa]">Company Website</label>
            <input
              type="text"
              placeholder="https://company.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Security & Password */}
        <div className="pt-4 border-t border-[#27272a] space-y-3">
          <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Lock size={14} />
            <span>Security & Password</span>
          </h3>

          <div className="space-y-1 max-w-sm">
            <label className="text-[11px] font-mono text-[#a1a1aa]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="pt-4 border-t border-[#27272a] space-y-3">
          <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Bell size={14} />
            <span>Notification Preferences</span>
          </h3>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-[#fafafa] cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="rounded bg-[#09090b] border-[#27272a] text-indigo-600 focus:ring-0"
              />
              <span>Receive email alerts when project progress is updated</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-[#fafafa] cursor-pointer">
              <input
                type="checkbox"
                checked={proposalAlerts}
                onChange={(e) => setProposalAlerts(e.target.checked)}
                className="rounded bg-[#09090b] border-[#27272a] text-indigo-600 focus:ring-0"
              />
              <span>Receive instant notifications when new proposals require authorization</span>
            </label>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Check size={14} />
            <span>{isSaving ? "Saving Changes..." : "Save Profile Details"}</span>
          </button>
        </div>
      </form>

    </div>
  );
}
