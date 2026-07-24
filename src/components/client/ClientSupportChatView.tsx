"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";
import { sendClientSupportChatMessage } from "@/app/actions";

interface ClientSupportChatViewProps {
  clientEmail: string;
  supportChat: any[];
  onRefresh: () => void;
}

export function ClientSupportChatView({ clientEmail, supportChat, onRefresh }: ClientSupportChatViewProps) {
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [supportChat]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const msg = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      await sendClientSupportChatMessage(clientEmail, msg);
      setIsSending(false);
      onRefresh();
    } catch (err) {
      console.error(err);
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4 font-sans text-xs text-[#fafafa] max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#121215] border border-[#27272a] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bot size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#fafafa] flex items-center gap-2">
              <span>Support AI Department</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-[#a1a1aa]">
              Answers project progress, SLA questions, and logs change orders.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
          No Hallucination Policy
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 rounded-xl bg-[#121215] border border-[#27272a] overflow-y-auto space-y-4 min-h-0">
        {supportChat && supportChat.length > 0 ? (
          supportChat.map((msg) => {
            const isUser = msg.sender === "client";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {isUser ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Content Bubble */}
                <div className={`p-3.5 rounded-xl space-y-1 ${
                  isUser
                    ? "bg-indigo-600 text-white"
                    : "bg-[#18181b] border border-[#27272a] text-[#fafafa]"
                }`}>
                  <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 font-mono">
                    <span>{msg.senderName}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-[#71717a] font-mono text-xs">
            Start a conversation with Support AI.
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-2 rounded-xl bg-[#121215] border border-[#27272a] flex items-center gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask Support AI about project progress, invoices, or bug reports..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending}
          className="flex-1 px-4 py-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-hidden focus:border-emerald-500 transition-colors"
        />
        <button
          type="submit"
          disabled={isSending || !inputText.trim()}
          className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Send size={13} />
          <span>{isSending ? "Sending..." : "Send"}</span>
        </button>
      </form>

    </div>
  );
}
