"use client";

import React, { useState } from "react";
import { X, Building2, User, Mail, Phone, Globe, FolderPlus, FileText, CheckCircle2 } from "lucide-react";
import { createClient } from "@/app/actions";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: () => void;
}

export function AddClientModal({ isOpen, onClose, onClientCreated }: AddClientModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [project, setProject] = useState("");
  const [contractType, setContractType] = useState("Monthly Retainer ($2,500/mo)");
  const [type, setType] = useState<"CLIENT" | "LEAD">("CLIENT");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Please provide a contact person name and email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createClient({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company.trim() || undefined,
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
        project: project.trim() || undefined,
        contractType: contractType.trim() || undefined,
        type,
        source: "Manual",
        notes: notes.trim() || undefined
      });

      setIsSubmitting(false);
      onClientCreated();
      onClose();

      // Reset form
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setWebsite("");
      setProject("");
      setNotes("");
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      setError("Failed to create client. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-xl bg-[#121215] border border-[#27272a] shadow-2xl overflow-hidden text-[#fafafa] font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#27272a] flex items-center justify-between bg-[#09090b]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Building2 size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#fafafa]">Add New Client Profile</h2>
              <p className="text-[11px] text-[#a1a1aa]">Create client record & link matching email histories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Type Selector (Client vs Lead) */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#09090b] border border-[#27272a]">
            <button
              type="button"
              onClick={() => setType("CLIENT")}
              className={`py-1.5 rounded-md text-xs font-semibold transition-all ${
                type === "CLIENT"
                  ? "bg-[#18181b] text-indigo-400 border border-indigo-500/30 shadow-xs"
                  : "text-[#71717a] hover:text-[#fafafa]"
              }`}
            >
              Active Client
            </button>
            <button
              type="button"
              onClick={() => setType("LEAD")}
              className={`py-1.5 rounded-md text-xs font-semibold transition-all ${
                type === "LEAD"
                  ? "bg-[#18181b] text-amber-400 border border-amber-500/30 shadow-xs"
                  : "text-[#71717a] hover:text-[#fafafa]"
              }`}
            >
              Prospect Lead
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Contact Person */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
                Contact Person <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                <input
                  type="email"
                  required
                  placeholder="sarah@acme-corp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Company Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
                Company Name
              </label>
              <div className="relative">
                <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                <input
                  type="text"
                  placeholder="Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                <input
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Website */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
                Website
              </label>
              <div className="relative">
                <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                <input
                  type="text"
                  placeholder="https://acme-corp.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Contract Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
                Contract Type
              </label>
              <input
                type="text"
                placeholder="Monthly Retainer ($2,500/mo)"
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Initial Project */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
              Initial Active Project (Optional)
            </label>
            <div className="relative">
              <FolderPlus size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
              <input
                type="text"
                placeholder="e.g. SAML OAuth Integration & Stripe Billing"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
              Client Directives & SOW Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. VIP Enterprise client. Retainer includes 20 dev hrs/mo. Scope creep requires $1,200 Change Order."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#27272a] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[#18181b] hover:bg-[#27272a] text-xs font-medium text-[#d4d4d8] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 size={14} />
              <span>{isSubmitting ? "Creating..." : "Create Client Profile"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
