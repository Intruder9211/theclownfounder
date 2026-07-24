"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Building2, 
  Phone, 
  Globe, 
  Search, 
  ArrowLeft, 
  Briefcase, 
  Clock, 
  Plus, 
  Sparkles, 
  Cpu, 
  FileText, 
  Calendar,
  CheckCircle2,
  Video,
  Check
} from "lucide-react";
import { getClients, updateClientAssignedAgents, updateProjectTaskProgress, addProjectToClient, updateClientNotes } from "@/app/actions";
import { AddClientModal } from "./AddClientModal";
import { HelpButton } from "./tour/HelpButton";
import { useTour } from "./tour/TourProvider";

interface ClientItem {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  website?: string | null;
  contractType?: string | null;
  notes?: string | null;
  type: string;
  source: string;
  status: string;
  createdAt: string;
  projects?: any[];
  proposals?: any[];
}

interface ClientsViewProps {
  setTab: (tab: string) => void;
}

export function ClientsView({ setTab }: ClientsViewProps) {
  const { showContextualHelp, triggerHelpForSection } = useTour();
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"ALL" | "CLIENT" | "LEAD">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadClientsData = async () => {
    try {
      setLoading(true);
      const list = await getClients();
      setClients(list as ClientItem[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientsData();
  }, []);

  const filteredClients = clients.filter((c) => {
    const matchesType = filterType === "ALL" || c.type === filterType;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      (c.company && c.company.toLowerCase().includes(query));
    return matchesType && matchesSearch;
  });

  const selectedClient = clients.find((c) => c.id === selectedClientId) || null;

  return (
    <div id="tour-clients-view" className="canvas p-8 overflow-y-auto h-full flex flex-col gap-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#fafafa] flex items-center gap-2">
            <span>Clients & Enterprise Contacts</span>
            {showContextualHelp && (
              <HelpButton sectionId="clients" onClick={triggerHelpForSection} />
            )}
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Auto-built company client database from inbound emails & sales activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          {clients.length > 0 && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={14} />
              <span>Add Client</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#71717a] font-mono animate-pulse">
          Loading client database from SQLite...
        </div>
      ) : clients.length === 0 ? (
        /* FIRST-TIME BEAUTIFUL EMPTY STATE */
        <div className="my-auto py-16 px-6 max-w-lg mx-auto rounded-xl bg-[#121215] border border-[#27272a] shadow-xl text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
            <Users size={24} />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-[#fafafa]">
              You don't have any clients yet.
            </h2>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Connect Gmail or create your first client to begin building your AI company.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={() => setTab("settings")}
              className="w-full sm:w-auto px-4 py-2 rounded-md bg-[#18181b] hover:bg-[#27272a] text-[#d4d4d8] border border-[#27272a] text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail size={14} className="text-indigo-400" />
              <span>Connect Gmail</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus size={14} />
              <span>Add Client</span>
            </button>
          </div>
        </div>
      ) : selectedClient ? (
        /* DEDICATED CLIENT PROFILE VIEW */
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          
          {/* Back Button */}
          <button
            onClick={() => setSelectedClientId(null)}
            className="self-start text-xs text-[#a1a1aa] hover:text-[#fafafa] flex items-center gap-1.5 font-medium transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Client Roster</span>
          </button>

          {/* Profile Header Card */}
          <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg uppercase font-mono">
                  {selectedClient.company ? selectedClient.company.slice(0, 2) : selectedClient.name.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#fafafa]">{selectedClient.company || selectedClient.name}</h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                      selectedClient.type === "CLIENT"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {selectedClient.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] font-medium">Contact: {selectedClient.name} • {selectedClient.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTab("meeting")}
                  className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Video size={13} />
                  <span>Start Project Huddle</span>
                </button>

                <span className="px-2.5 py-1 rounded bg-[#18181b] text-[11px] text-[#d4d4d8] font-mono border border-[#27272a]">
                  {selectedClient.contractType || "Retainer Active"}
                </span>
              </div>
            </div>

            {/* Quick Contact & Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#a1a1aa]">
              {selectedClient.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-[#71717a]" />
                  <span>{selectedClient.phone}</span>
                </div>
              )}
              {selectedClient.website && (
                <div className="flex items-center gap-2">
                  <Globe size={13} className="text-[#71717a]" />
                  <a href={selectedClient.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                    {selectedClient.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-[#71717a]" />
                <span>Added: {new Date(selectedClient.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Main Profile Grid Splits */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Active Projects & Email Histories */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Active Projects Card */}
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                    <Briefcase size={14} />
                    <span>Active Projects & Developer Task Logger</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#71717a]">
                    {selectedClient.projects ? selectedClient.projects.length : 0} projects
                  </span>
                </div>

                {/* Founder Manual Task Creation Bar */}
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center gap-2">
                  <input
                    type="text"
                    id={`new-task-input-${selectedClient.id}`}
                    placeholder="Founder manual task: e.g. WordPress Plugin Audit & SEO Optimization..."
                    className="flex-1 px-3 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const inputEl = document.getElementById(`new-task-input-${selectedClient.id}`) as HTMLInputElement;
                      if (inputEl && inputEl.value.trim()) {
                        await addProjectToClient(selectedClient.id, inputEl.value.trim());
                        inputEl.value = "";
                        loadClientsData();
                      }
                    }}
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus size={13} />
                    <span>Create Task</span>
                  </button>
                </div>

                {selectedClient.projects && selectedClient.projects.length > 0 ? (
                  <div className="space-y-4">
                    {selectedClient.projects.map((proj) => (
                      <div key={proj.id} className="p-4 rounded-lg bg-[#18181b] border border-[#27272a] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#fafafa] flex items-center gap-2">
                            <span>{proj.name}</span>
                            {proj.isCompleted && (
                              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                COMPLETED
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Developer Task Logger */}
                        <div className="space-y-2 pt-2 border-t border-[#27272a]">
                          <label className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider block">
                            Developer AI Progress Notes & Task Log
                          </label>
                          <textarea
                            rows={2}
                            defaultValue={proj.developerNotes || "e.g. Completed WordPress homepage theme setup, plugin configuration, and SSL proxy routing."}
                            id={`dev-notes-${proj.id}`}
                            className="w-full px-3 py-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors resize-none"
                          />

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-[#71717a]">
                              Marking DONE triggers QA Audit + Operations AI Delivery Proposal
                            </span>
                            <button
                              type="button"
                              onClick={async () => {
                                const el = document.getElementById(`dev-notes-${proj.id}`) as HTMLTextAreaElement;
                                const notes = el ? el.value : "Completed project tasks";
                                await updateProjectTaskProgress(proj.id, notes, true);
                                loadClientsData();
                              }}
                              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 size={13} />
                              <span>Mark Project DONE & Trigger Delivery</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[#18181b]/50 text-xs text-[#71717a] font-mono">
                    No explicit projects logged yet. Add a project via Add Client or project manager.
                  </div>
                )}
              </div>

              {/* Proposals & Email History Card */}
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                    <Mail size={14} />
                    <span>Inbound Email & Proposal History</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#71717a]">
                    {selectedClient.proposals ? selectedClient.proposals.length : 0} emails
                  </span>
                </div>

                {selectedClient.proposals && selectedClient.proposals.length > 0 ? (
                  <div className="space-y-3">
                    {selectedClient.proposals.map((prop) => (
                      <div key={prop.id} className="p-3.5 rounded-lg bg-[#18181b] border border-[#27272a] space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#fafafa]">
                          <span>{prop.subject}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            prop.status === "APPROVED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {prop.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#a1a1aa] line-clamp-2">{prop.bodyText}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[#18181b]/50 text-xs text-[#71717a] font-mono">
                    No email history attached yet.
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Assigned AI Units & Notes */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Assigned AI Units */}
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                    <Cpu size={14} />
                    <span>Assigned AI Departments</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">Permissions Active</span>
                </div>
                <div className="space-y-2 text-xs">
                  {["developer", "qa", "support", "operations", "sales"].map((dept) => (
                    <div key={dept} className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                      <span className="text-[#fafafa] font-medium capitalize">{dept} AI Unit</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Assigned
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Notes & Directives */}
              <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-2">
                    <FileText size={14} />
                    <span>Client Notes & Directives</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#71717a]">Auto-Syncs with AI</span>
                </div>
                <textarea
                  id={`client-notes-input-${selectedClient.id}`}
                  rows={3}
                  defaultValue={selectedClient.notes || "e.g. Client requested custom WordPress plugin integration with REST API OAuth2..."}
                  className="w-full px-3 py-2 rounded-[#09090b] bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors resize-none"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const notesEl = document.getElementById(`client-notes-input-${selectedClient.id}`) as HTMLTextAreaElement;
                    if (notesEl) {
                      await updateClientNotes(selectedClient.id, notesEl.value);
                      loadClientsData();
                    }
                  }}
                  className="w-full py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Check size={13} />
                  <span>Save Client Notes & Directives</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      ) : (
        /* CLIENT ROSTER GRID & SEARCH BAR */
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#121215] border border-[#27272a]">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
              <input
                type="text"
                placeholder="Search clients or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-md bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setFilterType("ALL")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  filterType === "ALL"
                    ? "bg-[#18181b] text-indigo-400 border border-indigo-500/30"
                    : "text-[#71717a] hover:text-[#fafafa]"
                }`}
              >
                All ({clients.length})
              </button>
              <button
                onClick={() => setFilterType("CLIENT")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  filterType === "CLIENT"
                    ? "bg-[#18181b] text-emerald-400 border border-emerald-500/30"
                    : "text-[#71717a] hover:text-[#fafafa]"
                }`}
              >
                Clients ({clients.filter((c) => c.type === "CLIENT").length})
              </button>
              <button
                onClick={() => setFilterType("LEAD")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  filterType === "LEAD"
                    ? "bg-[#18181b] text-amber-400 border border-amber-500/30"
                    : "text-[#71717a] hover:text-[#fafafa]"
                }`}
              >
                Leads ({clients.filter((c) => c.type === "LEAD").length})
              </button>
            </div>
          </div>

          {/* Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className="p-5 rounded-xl bg-[#121215] border border-[#27272a] hover:border-indigo-500/50 transition-all cursor-pointer space-y-3 group shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs font-mono">
                      {client.company ? client.company.slice(0, 2) : client.name.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#fafafa] group-hover:text-indigo-400 transition-colors">
                        {client.company || client.name}
                      </h3>
                      <p className="text-[11px] text-[#a1a1aa]">{client.name}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                    client.type === "CLIENT"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {client.type}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-[11px] text-[#71717a] font-mono">
                  <span>{client.email}</span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">Profile →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onClientCreated={loadClientsData}
      />
    </div>
  );
}
