"use client";

import React, { useState } from "react";
import { X, Cpu, Sparkles, CheckCircle2 } from "lucide-react";
import { createCustomAgent } from "@/app/actions";

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated: () => void;
}

export function AddAgentModal({ isOpen, onClose, onAgentCreated }: AddAgentModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [directives, setDirectives] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !role.trim()) {
      setError("Please provide an AI Unit Name and Role.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createCustomAgent({
        name: name.trim(),
        role: role.trim(),
        description: description.trim() || undefined,
        directives: directives.trim() || undefined
      });

      setIsSubmitting(false);
      onAgentCreated();
      onClose();

      setName("");
      setRole("");
      setDescription("");
      setDirectives("");
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      setError("Failed to create AI Agent. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-xl bg-[#121215] border border-[#27272a] shadow-2xl overflow-hidden text-[#fafafa] font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#27272a] flex items-center justify-between bg-[#09090b]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#fafafa]">Add Custom AI Department</h2>
              <p className="text-[11px] text-[#a1a1aa]">Spawn a new autonomous AI executive unit</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* AI Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
              AI Department Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Design AI or SEO AI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
              Executive Role & Responsibility <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. UI/UX Prototyping & Figma Auditor"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
              Brief Overview / Function
            </label>
            <input
              type="text"
              placeholder="Generates design tokens and enforces 8px grid layout"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Directives */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
              Operational Instructions & Directives
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Audit all developer task PRs for UI component compliance..."
              value={directives}
              onChange={(e) => setDirectives(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Actions */}
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
              <Sparkles size={14} />
              <span>{isSubmitting ? "Spawning..." : "Spawn AI Department"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
