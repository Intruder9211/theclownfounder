import React, { useState, useEffect, useRef } from "react";
import { 
  Video, 
  PhoneOff, 
  Send, 
  Users, 
  Sparkles, 
  Plus, 
  MessageSquare,
  Play,
  Volume2,
  Calendar,
  Layers,
  Check
} from "lucide-react";
import { AgentProfile } from "./AgentView";
import { 
  getMeetings, 
  createMeeting, 
  completeMeeting, 
  sendHuddleMessageAndGetResponse,
  sendMeetingMessage
} from "@/app/actions";

interface MeetingRoomProps {
  agents: AgentProfile[];
}

interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  bodyText: string;
  createdAt: string;
}

interface MeetingItem {
  id: string;
  title: string;
  type: string;
  agentId: string | null;
  participantIds: string | null;
  status: string;
  createdAt: string;
  messages: MessageItem[];
}

export function MeetingRoom({ agents }: MeetingRoomProps) {
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  
  // Huddle Form Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [huddleTitle, setHuddleTitle] = useState("");
  const [huddleType, setHuddleType] = useState<"one-on-one" | "all-hands" | "custom">("all-hands");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [customParticipants, setCustomParticipants] = useState<string[]>([]);

  // Input message state
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);

  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Load all meetings on mount
  const refreshMeetings = async (selectLatestId?: boolean) => {
    try {
      const data = await getMeetings();
      const formatted = data as unknown as MeetingItem[];
      setMeetings(formatted);
      
      if (selectLatestId && formatted.length > 0) {
        setSelectedMeetingId(formatted[0].id);
      }
    } catch (err) {
      console.error("Failed loading meetings:", err);
    }
  };

  useEffect(() => {
    refreshMeetings(true);
  }, []);

  // Scroll transcript to bottom on message update
  const selectedMeeting = meetings.find(m => m.id === selectedMeetingId) || null;
  
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMeeting?.messages, isSubmitting]);

  // Handle Starting Huddle
  const handleStartHuddle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let participantIds: string | undefined = undefined;
    if (huddleType === "custom") {
      if (customParticipants.length === 0) {
        alert("Please select at least one AI participant");
        return;
      }
      participantIds = customParticipants.join(",");
    }

    const title = huddleTitle.trim() || (
      huddleType === "all-hands" 
        ? "All-Hands Sync" 
        : huddleType === "custom" 
        ? "Custom Group Sync" 
        : `Sync with ${agents.find(a => a.id === selectedAgentId)?.name || "Agent"}`
    );

    // Capture state variables into local constants before resetting
    const activeHuddleType = huddleType;
    const activeAgentId = selectedAgentId;
    const activeCustomParticipants = [...customParticipants];

    try {
      const created = await createMeeting(
        title, 
        activeHuddleType, 
        activeHuddleType === "one-on-one" ? activeAgentId : undefined,
        participantIds
      );
      
      setModalOpen(false);
      setHuddleTitle("");
      setSelectedAgentId("");
      setCustomParticipants([]);
      
      // Post initial greeting message from the summoned AIs using local constants
      const greetingText = activeHuddleType === "all-hands"
        ? "AI Company Huddle Room active. All departments online. State your agenda, Founder."
        : activeHuddleType === "custom"
        ? `Custom sync room active with departments: ${activeCustomParticipants.map(id => agents.find(a => a.id === id)?.name || id).join(", ")}. Online and ready.`
        : `${agents.find(a => a.id === activeAgentId)?.name || "Agent"} online. Sync initiated. What directives would you like to review?`;
      
      const greetingSenderId = activeHuddleType === "all-hands" 
        ? "ceo-assistant" 
        : activeHuddleType === "custom" 
        ? activeCustomParticipants[0] 
        : activeAgentId;
      const greetingSenderName = activeHuddleType === "all-hands" 
        ? "CEO Assistant AI" 
        : activeHuddleType === "custom" 
        ? (agents.find(a => a.id === activeCustomParticipants[0])?.name || "Agent AI") 
        : (agents.find(a => a.id === activeAgentId)?.name || "Agent AI");

      await sendMeetingMessage(created.id, greetingSenderId, greetingSenderName, greetingText);
      await refreshMeetings();
      setSelectedMeetingId(created.id);
    } catch (err) {
      console.error("Failed starting huddle:", err);
    }
  };

  // Handle sending message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedMeetingId || isSubmitting) return;

    const messageToSend = inputText.trim();
    setInputText("");
    setIsSubmitting(true);
    setActiveSpeaker("founder");

    try {
      // Send founder message and get response in one atomic action to prevent DB locks
      const updatedMessages = await sendHuddleMessageAndGetResponse(selectedMeetingId, messageToSend);
      
      // Update meetings in state to render newly appended messages
      setMeetings((prev) =>
        prev.map((m) =>
          m.id === selectedMeetingId
            ? { ...m, messages: updatedMessages as unknown as MessageItem[] }
            : m
        )
      );

      // Randomly animate speakers briefly to simulate huddle voice chatter
      if (selectedMeeting?.type !== "one-on-one") {
        const pIds = selectedMeeting?.participantIds
          ? selectedMeeting.participantIds.split(",")
          : agents.map(a => a.id);
        const randomSpeaker = pIds[Math.floor(Math.random() * pIds.length)];
        setActiveSpeaker(randomSpeaker);
      } else {
        setActiveSpeaker(selectedMeeting.agentId);
      }
    } catch (err) {
      console.error("Error in huddle communication:", err);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setActiveSpeaker(null), 3000);
    }
  };

  // Handle ending/completing huddle
  const handleEndHuddle = async () => {
    if (!selectedMeetingId) return;
    try {
      await completeMeeting(selectedMeetingId);
      await refreshMeetings();
    } catch (err) {
      console.error("Failed completing huddle:", err);
    }
  };

  // Participant list for active meeting
  const getParticipants = () => {
    if (!selectedMeeting) return [];
    if (selectedMeeting.type === "one-on-one") {
      const agent = agents.find(a => a.id === selectedMeeting.agentId);
      return agent ? [agent] : [];
    }
    if (selectedMeeting.type === "custom") {
      if (!selectedMeeting.participantIds) return [];
      const ids = selectedMeeting.participantIds.split(",");
      return agents.filter(a => ids.includes(a.id));
    }
    // All hands includes all active agents
    return agents.filter(a => a.isActive);
  };

  const activeParticipants = getParticipants();

  return (
    <div 
      className="canvas" 
      style={{ 
        display: "flex", 
        flexDirection: "row", 
        height: "100%", 
        overflow: "hidden",
        backgroundColor: "hsl(var(--bg-base))"
      }}
    >
      {/* 1. Left Sidebar - Huddles list */}
      <div 
        style={{ 
          width: "240px", 
          borderRight: "1px solid hsl(var(--border-muted))",
          backgroundColor: "hsl(var(--bg-surface))",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0
        }}
      >
        {/* Header */}
        <div 
          style={{ 
            padding: "16px 20px", 
            borderBottom: "1px solid hsl(var(--border-muted))",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>AI Council Sessions</span>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              borderRadius: "4px",
              backgroundColor: "hsl(var(--bg-elevated))",
              border: "1px solid hsl(var(--border-muted))",
              color: "hsl(var(--text-primary))",
              cursor: "pointer"
            }}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Meeting List */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {meetings.length === 0 ? (
            <div style={{ padding: "32px 16px", color: "hsl(var(--text-dim))", textAlign: "center", fontSize: "12px" }}>
              No huddles logged
            </div>
          ) : (
            meetings.map((m) => {
              const isSelected = m.id === selectedMeetingId;
              const isActive = m.status === "ACTIVE";
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeetingId(m.id)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "hsl(var(--bg-elevated))" : "transparent",
                    borderBottom: "1px solid hsl(var(--border-muted))",
                    borderLeft: isSelected ? "2px solid hsl(var(--border-focus))" : "2px solid transparent",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span 
                      style={{ 
                        fontSize: "12px", 
                        fontWeight: 600, 
                        color: "hsl(var(--text-primary))",
                        maxWidth: "140px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {m.title}
                    </span>
                    <span 
                      style={{ 
                        height: "5px", 
                        width: "5px", 
                        borderRadius: "50%", 
                        backgroundColor: isActive ? "hsl(var(--success))" : "hsl(var(--text-dim))" 
                      }} 
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "6px", color: "hsl(var(--text-dim))", fontSize: "10px" }}>
                    <Users size={10} />
                    <span>{m.type === "all-hands" ? "All Hands" : "1-on-1"}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Main Active Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {selectedMeeting ? (
          <>
            {/* Top Workspace Bar */}
            <div 
              style={{ 
                padding: "16px 24px", 
                borderBottom: "1px solid hsl(var(--border-muted))",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "hsl(var(--bg-surface))",
                flexShrink: 0
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h1 style={{ fontSize: "14px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>{selectedMeeting.title}</h1>
                  <span 
                    style={{
                      fontSize: "9px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: selectedMeeting.status === "ACTIVE" ? "rgba(16, 185, 129, 0.08)" : "rgba(113, 113, 122, 0.08)",
                      color: selectedMeeting.status === "ACTIVE" ? "hsl(var(--success))" : "hsl(var(--text-dim))",
                      border: selectedMeeting.status === "ACTIVE" ? "1px solid rgba(16, 185, 129, 0.15)" : "1px solid rgba(113, 113, 122, 0.15)"
                    }}
                  >
                    {selectedMeeting.status === "ACTIVE" ? "Huddle Active" : "Archived"}
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "hsl(var(--text-dim))" }}>
                  Session ID: {selectedMeeting.id.slice(0, 8)}
                </span>
              </div>
              
              {selectedMeeting.status === "ACTIVE" && (
                <button
                  onClick={handleEndHuddle}
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "hsl(var(--error))",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <PhoneOff size={12} />
                  <span>End Huddle</span>
                </button>
              )}
            </div>

            {/* Conference speaker grid */}
            <div 
              style={{ 
                padding: "24px", 
                backgroundColor: "hsl(var(--bg-base))",
                borderBottom: "1px solid hsl(var(--border-muted))",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                maxHeight: "260px",
                overflowY: "auto",
                flexShrink: 0
              }}
            >
              {/* Founder grid card */}
              <div 
                style={{
                  backgroundColor: "hsl(var(--bg-surface))",
                  border: `1.5px solid ${activeSpeaker === "founder" ? "hsl(var(--border-focus))" : "hsl(var(--border-muted))"}`,
                  boxShadow: activeSpeaker === "founder" ? "0 0 12px rgba(99, 102, 241, 0.2)" : "none",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  transition: "all 0.3s ease"
                }}
              >
                <div 
                  style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "50%", 
                    backgroundColor: "hsl(var(--bg-elevated))", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    color: "hsl(var(--text-primary))",
                    fontWeight: 700,
                    fontSize: "14px",
                    border: activeSpeaker === "founder" ? "2px solid hsl(var(--border-focus))" : "2px solid transparent"
                  }}
                  className={activeSpeaker === "founder" ? "animate-pulse-dot" : ""}
                >
                  F
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>Founder</span>
                  <p style={{ fontSize: "10px", color: "hsl(var(--text-dim))", marginTop: "2px" }}>Owner & Decider</p>
                </div>
              </div>

              {/* AI Participant grid cards */}
              {activeParticipants.map((p) => {
                const isSpeaking = activeSpeaker === p.id;
                const isThinking = isSubmitting && isSpeaking;
                return (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: "hsl(var(--bg-surface))",
                      border: `1.5px solid ${isSpeaking ? "hsl(var(--border-focus))" : "hsl(var(--border-muted))"}`,
                      boxShadow: isSpeaking ? "0 0 12px rgba(99, 102, 241, 0.2)" : "none",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <div 
                      style={{ 
                        width: "48px", 
                        height: "48px", 
                        borderRadius: "50%", 
                        backgroundColor: "hsl(var(--bg-elevated))", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        color: isSpeaking ? "hsl(var(--accent))" : "hsl(var(--text-muted))",
                        fontWeight: 700,
                        fontSize: "12px",
                        border: isSpeaking ? "2px solid hsl(var(--border-focus))" : "2px solid transparent"
                      }}
                      className={isSpeaking && !isThinking ? "animate-pulse-dot" : ""}
                    >
                      AI
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>{p.name}</span>
                      <p style={{ fontSize: "9px", color: "hsl(var(--text-dim))", marginTop: "2px", textOverflow: "ellipsis", maxWidth: "160px", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {isThinking ? "Thinking..." : isSpeaking ? "Speaking..." : "Listening"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Transcript timeline area */}
            <div 
              style={{ 
                flex: 1, 
                padding: "24px", 
                overflowY: "auto", 
                display: "flex", 
                flexDirection: "column", 
                gap: "16px",
                backgroundColor: "hsl(var(--bg-surface))"
              }}
            >
              {selectedMeeting.messages.map((msg) => {
                const isFounder = msg.senderId === "founder";
                return (
                  <div 
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      alignSelf: isFounder ? "flex-end" : "flex-start",
                      maxWidth: "75%"
                    }}
                  >
                    {/* Message metadata */}
                    <div 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px", 
                        fontSize: "10px", 
                        color: "hsl(var(--text-dim))",
                        justifyContent: isFounder ? "flex-end" : "flex-start"
                      }}
                    >
                      <span style={{ fontWeight: 600, color: isFounder ? "hsl(var(--accent))" : "hsl(var(--text-primary))" }}>
                        {msg.senderName}
                      </span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Message bubble */}
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        lineHeight: "1.5",
                        backgroundColor: isFounder ? "hsl(var(--bg-elevated))" : "hsl(var(--bg-base))",
                        color: "hsl(var(--text-primary))",
                        border: "1px solid " + (isFounder ? "hsl(var(--border-muted))" : "hsl(var(--border-muted))")
                      }}
                    >
                      {msg.bodyText}
                    </div>
                  </div>
                );
              })}
              
              {/* Local generating bubble */}
              {isSubmitting && (
                <div 
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    alignSelf: "flex-start",
                    maxWidth: "75%"
                  }}
                >
                  <div style={{ fontSize: "10px", color: "hsl(var(--text-dim))" }}>
                    <span style={{ fontWeight: 600 }}>Sync Room</span>
                  </div>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      lineHeight: "1.5",
                      backgroundColor: "hsl(var(--bg-base))",
                      color: "hsl(var(--text-muted))",
                      border: "1px solid hsl(var(--border-muted))"
                    }}
                  >
                    AI Employees are compiling database diagnostics and guidelines...
                  </div>
                </div>
              )}

              <div ref={transcriptEndRef} />
            </div>

            {/* Bottom text inputs */}
            <div 
              style={{ 
                padding: "20px 24px", 
                borderTop: "1px solid hsl(var(--border-muted))",
                backgroundColor: "hsl(var(--bg-surface))",
                flexShrink: 0
              }}
            >
              {selectedMeeting.status === "ACTIVE" ? (
                <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Ask questions or type directives (e.g. 'Support AI, what is our refund policy?')..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      flex: 1,
                      backgroundColor: "hsl(var(--bg-base))",
                      border: "1px solid hsl(var(--border-muted))",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      color: "hsl(var(--text-primary))",
                      fontSize: "12px"
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSubmitting}
                    style={{
                      backgroundColor: "hsl(var(--text-primary))",
                      color: "hsl(var(--bg-base))",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0 16px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontSize: "12px",
                      opacity: (!inputText.trim() || isSubmitting) ? 0.5 : 1
                    }}
                  >
                    <Send size={12} />
                    <span>Send</span>
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: "center", fontSize: "11px", color: "hsl(var(--text-dim))" }}>
                  This huddle has been completed. Transcripts are archived in the Company Brain.
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty Active Huddle view */
          <div 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              flex: 1, 
              padding: "48px",
              gap: "16px",
              color: "hsl(var(--text-dim))"
            }}
          >
            <div 
              style={{ 
                width: "48px", 
                height: "48px", 
                borderRadius: "50%", 
                backgroundColor: "hsl(var(--bg-surface))",
                border: "1px solid hsl(var(--border-muted))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "hsl(var(--text-muted))"
              }}
            >
              <Video size={20} />
            </div>
            <div style={{ textAlign: "center", maxWidth: "320px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "hsl(var(--text-primary))" }}>Huddle Room</span>
              <p style={{ fontSize: "11px", color: "hsl(var(--text-muted))", marginTop: "6px", lineHeight: "1.5" }}>
                Host sync calls with your autonomous team. Start a 1-on-1 huddle or call an All-Hands meeting to review company goals.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                backgroundColor: "white",
                color: "black",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontWeight: 600,
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "8px"
              }}
            >
              <Plus size={14} />
              <span>Start Huddle</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Modal Start Huddle dialog */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <form
            onSubmit={handleStartHuddle}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "hsl(var(--bg-surface))",
              border: "1px solid hsl(var(--border-muted))",
              borderRadius: "8px",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >
            {/* Header */}
            <div>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "hsl(var(--text-primary))" }}>Initiate Company Huddle</span>
              <p style={{ fontSize: "11px", color: "hsl(var(--text-dim))", marginTop: "4px" }}>Select department alignment options.</p>
            </div>

            {/* Title field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase" }}>
                Huddle Title
              </label>
              <input
                type="text"
                placeholder={huddleType === "all-hands" ? "All-Hands Sync" : "One-on-One Sync"}
                value={huddleTitle}
                onChange={(e) => setHuddleTitle(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "hsl(var(--bg-base))",
                  border: "1px solid hsl(var(--border-muted))",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  color: "hsl(var(--text-primary))",
                  fontSize: "12px"
                }}
              />
            </div>

            {/* Type selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase" }}>
                Huddle Type
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setHuddleType("all-hands")}
                  style={{
                    flex: 1,
                    padding: "8px 4px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 500,
                    cursor: "pointer",
                    backgroundColor: huddleType === "all-hands" ? "hsl(var(--bg-elevated))" : "transparent",
                    border: `1px solid ${huddleType === "all-hands" ? "hsl(var(--border-focus))" : "hsl(var(--border-muted))"}`,
                    color: huddleType === "all-hands" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))"
                  }}
                >
                  All Hands
                </button>
                <button
                  type="button"
                  onClick={() => setHuddleType("one-on-one")}
                  style={{
                    flex: 1,
                    padding: "8px 4px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 500,
                    cursor: "pointer",
                    backgroundColor: huddleType === "one-on-one" ? "hsl(var(--bg-elevated))" : "transparent",
                    border: `1px solid ${huddleType === "one-on-one" ? "hsl(var(--border-focus))" : "hsl(var(--border-muted))"}`,
                    color: huddleType === "one-on-one" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))"
                  }}
                >
                  1-on-1 Sync
                </button>
                <button
                  type="button"
                  onClick={() => setHuddleType("custom")}
                  style={{
                    flex: 1,
                    padding: "8px 4px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 500,
                    cursor: "pointer",
                    backgroundColor: huddleType === "custom" ? "hsl(var(--bg-elevated))" : "transparent",
                    border: `1px solid ${huddleType === "custom" ? "hsl(var(--border-focus))" : "hsl(var(--border-muted))"}`,
                    color: huddleType === "custom" ? "hsl(var(--text-primary))" : "hsl(var(--text-muted))"
                  }}
                >
                  Custom Sync
                </button>
              </div>
            </div>

            {/* Agent selector (for 1-on-1) */}
            {huddleType === "one-on-one" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase" }}>
                  AI Employee
                </label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    backgroundColor: "hsl(var(--bg-base))",
                    border: "1px solid hsl(var(--border-muted))",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    color: "hsl(var(--text-primary))",
                    fontSize: "12px"
                  }}
                >
                  <option value="" disabled>Select active AI...</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Custom Multi-Agent Checkbox List */}
            {huddleType === "custom" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "hsl(var(--text-dim))", textTransform: "uppercase" }}>
                  Select AI Participants
                </label>
                <div 
                  style={{ 
                    maxHeight: "145px", 
                    overflowY: "auto", 
                    border: "1px solid hsl(var(--border-muted))", 
                    borderRadius: "6px", 
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    backgroundColor: "hsl(var(--bg-base))"
                  }}
                >
                  {agents.map((a) => (
                    <label key={a.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "hsl(var(--text-primary))", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={customParticipants.includes(a.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomParticipants(prev => [...prev, a.id]);
                          } else {
                            setCustomParticipants(prev => prev.filter(id => id !== a.id));
                          }
                        }}
                      />
                      <span>{a.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  backgroundColor: "transparent",
                  border: "1px solid hsl(var(--border-muted))",
                  color: "hsl(var(--text-muted))",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  backgroundColor: "hsl(var(--text-primary))",
                  color: "hsl(var(--bg-base))",
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer",
                  border: "none"
                }}
              >
                Join Room
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
