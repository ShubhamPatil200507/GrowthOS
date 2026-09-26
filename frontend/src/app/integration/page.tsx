'use client';

import React, { useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  Server, 
  Volume2, 
  BrainCircuit, 
  Workflow, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

export default function IntegrationPage() {
  const [isLiveMode, setIsLiveMode] = useState(false);

  const connectors = [
    {
      name: "Paytm Merchant Data Provider",
      type: "Merchant Telemetry & Transactions",
      status: "CONNECTED",
      mode: isLiveMode ? "Paytm Sandbox API" : "MockPaytmProvider (Deterministic)",
      latency: "14ms",
      details: "Fetches aggregated hourly sales, basket details, customer frequency."
    },
    {
      name: "Paytm Action & Soundbox Provider",
      type: "Action Dispatch & Voice Collateral",
      status: "CONNECTED",
      mode: isLiveMode ? "Paytm IoT Soundbox API" : "MockSoundbox & QR Generator",
      latency: "28ms",
      details: "Dispatches promotional audio prompts and QR discount vouchers."
    },
    {
      name: "Sarvam AI Multilingual Voice Suite",
      type: "Hinglish/Hindi Speech & TTS",
      status: "CONNECTED",
      mode: "SarvamProvider (Mock Fallback)",
      latency: "45ms",
      details: "Handles natural voice commands and produces store audio announcements."
    },
    {
      name: "Cognee Cognitive Memory Provider",
      type: "Long-term Knowledge Graph",
      status: "CONNECTED",
      mode: "LocalMemoryProvider (Fast SQLite Fallback)",
      latency: "8ms",
      details: "Stores campaign learnings, merchant rules, and item affinities."
    },
    {
      name: "n8n Automation Engine",
      type: "Workflow Dispatch & Webhooks",
      status: "CONNECTED",
      mode: "N8nWebhookAdapter / LocalWorkflowExecutor",
      latency: "12ms",
      details: "Executes 6-stage approved growth workflows across channels."
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002970] bg-[#00BAF2]/15 px-2.5 py-0.5 rounded-full">
            <Share2 className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>PROVIDER ABSTRACTION LAYER</span>
          </div>
          <h1 className="text-2xl font-black text-[#002970] tracking-tight">
            System Integrations & APIs
          </h1>
          <p className="text-xs text-slate-500">
            Abstract provider interfaces allow seamless switching between local deterministic mocks and live APIs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F5FAFD] p-1.5 rounded-xl border border-[#E0EFF7]">
          <span className="text-xs font-bold text-slate-600 px-2">Mode:</span>
          <button
            onClick={() => setIsLiveMode(false)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
              !isLiveMode ? "bg-[#002970] text-white" : "bg-white text-slate-700 shadow-sm"
            }`}
          >
            Standalone Prototype
          </button>
          <button
            onClick={() => setIsLiveMode(true)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
              isLiveMode ? "bg-[#00BAF2] text-white" : "bg-white text-slate-700 shadow-sm"
            }`}
          >
            Live Connectors
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {connectors.map((c, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-5 space-y-2 hover:border-[#00BAF2] transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{c.name}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{c.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {c.latency}
                </span>
                <span className="text-[10px] font-bold text-[#00A37A] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {c.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-600 leading-relaxed">{c.details}</span>
              <span className="font-mono text-[11px] font-semibold text-[#002970] bg-[#00BAF2]/10 px-2 py-0.5 rounded flex-shrink-0">
                {c.mode}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
