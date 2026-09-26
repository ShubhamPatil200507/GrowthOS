'use client';

import React from 'react';
import { 
  Layers, 
  ShieldCheck, 
  Workflow, 
  BrainCircuit, 
  Sparkles, 
  Database, 
  Volume2, 
  QrCode 
} from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002970] bg-[#00BAF2]/15 px-2.5 py-0.5 rounded-full">
            <Layers className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>FULL-STACK SYSTEM DESIGN</span>
          </div>
          <h1 className="text-2xl font-black text-[#002970] tracking-tight">
            GrowthOS Architecture & Core Loop
          </h1>
          <p className="text-xs text-slate-500">
            OBSERVE → DETECT → REASON → RECOMMEND → APPROVE → EXECUTE → MEASURE → LEARN
          </p>
        </div>
      </div>

      {/* Layer breakdown cards */}
      <div className="space-y-4">
        {/* Layer 1: Merchant Touchpoints */}
        <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-[#002970]">
              1. Merchant Touchpoint Layer (Voice, Soundbox, Web App)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">TOUCHPOINTS</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Merchants interact via natural spoken Hinglish/Hindi or English through mobile web PWA, Soundbox voice prompts, or the conversational assistant. Powered by Sarvam AI speech models.
          </p>
        </div>

        {/* Layer 2: Agentic Orchestration */}
        <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-[#002970]">
              2. 8-Agent Specialized Intelligence Orchestrator
            </h3>
            <span className="text-[10px] font-mono text-[#00BAF2] font-bold">ORCHESTRATION</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Modular agents work in consensus: Context Agent, Analytics Engine, Opportunity Miner, Customer RFM Agent, Action Planner, Experiment Tracker, Safe Explanation Generator, and Memory Agent.
          </p>
        </div>

        {/* Layer 3: Safety Guardrails */}
        <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-emerald-800">
              3. Safe Language Guardrails & Human-in-the-Loop Gateway
            </h3>
            <span className="text-[10px] font-mono text-[#00A37A] font-bold">GOVERNANCE</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict policy bounds prevent revenue guarantees and non-compliant credit promises. All actions require explicit merchant cryptographic approval before execution triggers.
          </p>
        </div>

        {/* Layer 4: Execution Engine */}
        <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-[#002970]">
              4. Multi-Channel Execution Engine (n8n & Paytm Providers)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">EXECUTION</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dispatches approved actions to Paytm Soundbox IoT, voucher management, customer WhatsApp messaging, and generates printable counter QR collaterals.
          </p>
        </div>

        {/* Layer 5: Data & Cognitive Memory */}
        <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-[#002970]">
              5. Data Layer & Cognee Cognitive Memory
            </h3>
            <span className="text-[10px] font-mono text-slate-400">STORAGE & COGNITION</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Stores telemetry, RFM customer cohorts, and longitudinal campaign results in Cognee knowledge graphs to inform subsequent growth cycles.
          </p>
        </div>
      </div>
    </div>
  );
}
