"use client";

import React from "react";
import { FolderDown, FileText, Download, ShieldCheck } from "lucide-react";

interface ClientFilesViewProps {
  files: any[];
}

export function ClientFilesView({ files }: ClientFilesViewProps) {
  return (
    <div className="space-y-6 font-sans text-xs text-[#fafafa] max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 rounded-xl bg-[#121215] border border-[#27272a]">
        <div>
          <h2 className="text-base font-bold text-[#fafafa] flex items-center gap-2">
            <FolderDown size={16} className="text-indigo-400" />
            <span>Shared Documents, Contracts & Invoices</span>
          </h2>
          <p className="text-xs text-[#a1a1aa] mt-0.5">
            Download verified SOW contracts, invoice receipts, and project deliverables.
          </p>
        </div>
        <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 flex items-center gap-1">
          <ShieldCheck size={12} />
          <span>Client Scope Protected</span>
        </span>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files && files.map((file) => (
          <div key={file.id} className="p-5 rounded-xl bg-[#121215] border border-[#27272a] hover:border-indigo-500/50 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <FileText size={16} />
                </div>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {file.category}
                </span>
              </div>
              <h3 className="font-semibold text-xs text-[#fafafa] line-clamp-2 leading-snug">
                {file.name}
              </h3>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a]">
                <span>Size: {file.size}</span>
                <span>{file.date}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Downloading document: ${file.name}`)}
              className="w-full py-2 rounded bg-[#18181b] hover:bg-indigo-600 hover:text-white text-[#a1a1aa] font-semibold text-xs border border-[#27272a] hover:border-indigo-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Download size={13} />
              <span>Download File</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
