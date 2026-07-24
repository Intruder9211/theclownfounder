"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getClientPortalData } from "@/app/actions";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHomeView } from "@/components/client/ClientHomeView";
import { ClientProjectsView } from "@/components/client/ClientProjectsView";
import { ClientProposalsView } from "@/components/client/ClientProposalsView";
import { ClientSupportChatView } from "@/components/client/ClientSupportChatView";
import { ClientFilesView } from "@/components/client/ClientFilesView";
import { ClientTimelineView } from "@/components/client/ClientTimelineView";
import { ClientProfileView } from "@/components/client/ClientProfileView";

export default function ClientPortalPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("home");
  const [clientEmail, setClientEmail] = useState("sarah@acme-corp.com");
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async (emailStr?: string) => {
    const targetEmail = emailStr || clientEmail;
    try {
      const data = await getClientPortalData(targetEmail);
      setClientData(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("clownfounder_current_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.email) {
          setClientEmail(parsed.email);
          loadData(parsed.email);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    loadData("sarah@acme-corp.com");
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem("clownfounder_current_user");
      localStorage.removeItem("clownfounder_portal_role");
    } catch (e) {}
    router.push("/");
  };

  if (isLoading || !clientData) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-xs text-[#a1a1aa] font-mono">
        Loading Client Portal...
      </div>
    );
  }

  const clientInfo = clientData.client || {};

  return (
    <div className="flex h-screen bg-[#09090b] text-[#fafafa] overflow-hidden select-none font-sans">
      
      {/* Client Minimal Sidebar */}
      <ClientSidebar
        currentTab={currentTab}
        setTab={setCurrentTab}
        clientEmail={clientEmail}
        clientCompany={clientInfo.company || clientInfo.name}
        onSignOut={handleSignOut}
      />

      {/* Client Main Workspace */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {currentTab === "home" && (
          <ClientHomeView
            clientName={clientInfo.name || "Client"}
            companyName={clientInfo.company}
            projects={clientData.projects}
            proposals={clientData.proposals}
            timeline={clientData.timeline}
            supportChat={clientData.supportChat}
            setTab={setCurrentTab}
          />
        )}

        {currentTab === "projects" && (
          <ClientProjectsView projects={clientData.projects} />
        )}

        {currentTab === "proposals" && (
          <ClientProposalsView
            proposals={clientData.proposals}
            onRefresh={() => loadData(clientEmail)}
            setTab={setCurrentTab}
          />
        )}

        {currentTab === "support" && (
          <ClientSupportChatView
            clientEmail={clientEmail}
            supportChat={clientData.supportChat}
            onRefresh={() => loadData(clientEmail)}
          />
        )}

        {currentTab === "files" && (
          <ClientFilesView files={clientData.files} />
        )}

        {currentTab === "timeline" && (
          <ClientTimelineView timeline={clientData.timeline} />
        )}

        {currentTab === "profile" && (
          <ClientProfileView
            client={clientInfo}
            clientEmail={clientEmail}
            onRefresh={() => loadData(clientEmail)}
          />
        )}
      </main>

    </div>
  );
}
