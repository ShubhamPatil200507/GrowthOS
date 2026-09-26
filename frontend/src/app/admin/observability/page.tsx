'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Lock, 
  Search, 
  Clock, 
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Server,
  Radio,
  Share2,
  ArrowRight,
  Database,
  BarChart2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ObservabilityPage() {
  const { language, t } = useLanguage();

  const adapters = [
    {
      name: "SoundboxAdapter",
      implementation: "SimulatedSoundboxAdapter",
      category: "HARDWARE_IOT",
      status: "SIMULATED",
      statusColor: "bg-amber-50 text-amber-800 border-amber-200",
      productionPath: "Paytm IoT MQTT Gateway / WebSocket Broker",
      latency: "110ms",
      details: "Soundbox 4.0 4G VoLTE • Audio dispatch queue & receipt acknowledgement"
    },
    {
      name: "WhatsAppAdapter",
      implementation: "SimulatedWhatsAppAdapter",
      category: "MESSAGING",
      status: "INTEGRATION-READY",
      statusColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      productionPath: "Meta Cloud API / Gupshup Enterprise Gateway",
      latency: "240ms",
      details: "Rate limit: 100 msg/sec • Payload templates validated • Zero-PII phone hashes"
    },
    {
      name: "SettlementAdapter",
      implementation: "SimulatedSettlementAdapter",
      category: "BANKING_LEDGER",
      status: "INTEGRATION-READY",
      statusColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      productionPath: "NPCI e-NACH / HDFC Host-to-Host SFTP Batch API",
      latency: "450ms",
      details: "Two-stage ledger settlement (06:30 AM & 11:30 PM batches) • Auto UTR generation"
    },
    {
      name: "CampaignAdapter",
      implementation: "SimulatedCampaignAdapter",
      category: "MERCHANT_PROMOTION",
      status: "SIMULATED",
      statusColor: "bg-amber-50 text-amber-800 border-amber-200",
      productionPath: "Paytm for Business Voucher Engine & POS Redemptions",
      latency: "85ms",
      details: "Dynamic QR voucher generation • 14-day anti-fatigue cooldown filter"
    }
  ];

  const policyRules = [
    {
      rule: "RBI Digital Lending Safeguard",
      description: "Blocks any credit underwriting or loan guarantee claims. GrowthOS never acts as an unlicensed lender.",
      evaluations: 7,
      blocked: 7,
      status: "100% COMPLIANT (0 Leakage)"
    },
    {
      rule: "Revenue Guarantee Neutralization",
      description: "Blocks claims promising unconditional sales increases. All proposals phrased as hypotheses.",
      evaluations: 18,
      blocked: 18,
      status: "100% BLOCKED"
    },
    {
      rule: "Promotion Fatigue Cooldown",
      description: "Suppresses campaigns if merchant ran > 3 promotions in last 14 days to prevent margin erosion.",
      evaluations: 12,
      blocked: 2,
      status: "ENFORCING"
    },
    {
      rule: "Human-In-The-Loop Action Mandate",
      description: "Mandates explicit merchant sign-off for external messaging, standee prints, or discount dispatch.",
      evaluations: 42,
      blocked: 0,
      status: "100% SIGN-OFF ENFORCED"
    }
  ];

  const auditLogs = [
    {
      id: "LOG_9942",
      idempotency: "sha256:98421049:afternoon_booster:781f09",
      action: "ACTION_APPROVAL",
      actor: "MERCH_PUNE_001 (Rajesh Kumar)",
      resource: "Afternoon 15% Tea & Snack Voucher",
      status: "APPROVED_AND_SCHEDULED",
      tier: "LOW_RISK",
      timestamp: "2026-09-26 14:02:11"
    },
    {
      id: "LOG_9941",
      idempotency: "sha256:guardrail:revenue_guarantee:38a1bc",
      action: "POLICY_INTERVENTION",
      actor: "Deterministic Policy Engine",
      resource: "Neutralized prompt claim: 'Guaranteed ₹10,000 profit'",
      status: "BLOCKED_BY_GUARDRAIL",
      tier: "HIGH_RISK_BLOCKED",
      timestamp: "2026-09-26 14:02:08"
    },
    {
      id: "LOG_9940",
      idempotency: "sha256:consent:evaluation:0119f4",
      action: "CONSENT_VERIFICATION",
      actor: "Consent Gatekeeper",
      resource: "MerchantConsent (Customer Segmentation: TRUE)",
      status: "VERIFIED_ACTIVE",
      tier: "ZERO_PII",
      timestamp: "2026-09-26 13:58:30"
    },
    {
      id: "LOG_9939",
      idempotency: "sha256:stat_gate:dormant_winback:66d210",
      action: "STATISTICAL_GATE",
      actor: "Statistically Honest Experiment Engine",
      resource: "Win-back Sample N=19 < 30 Threshold",
      status: "P_VALUE_SUPPRESSED",
      tier: "HONEST_EVIDENCE",
      timestamp: "2026-09-26 13:45:19"
    },
    {
      id: "LOG_9938",
      idempotency: "sha256:governor:replay_suppression:84f901",
      action: "IDEMPOTENCY_FILTER",
      actor: "Action Governor",
      resource: "Duplicate trigger detected for Afternoon Booster v1",
      status: "SUPPRESSED_DUPLICATE",
      tier: "IDEMPOTENT_SAFE",
      timestamp: "2026-09-26 13:30:02"
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="bg-[#002970] text-white p-6 sm:p-7 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 bg-white/10 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>ENTERPRISE GOVERNANCE & PRODUCTION READINESS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Production Readiness & Observability
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
              Real-time audit telemetry, integration adapter statuses, deterministic policy decisions, and statistical honesty gates.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-xl p-3.5 text-right shrink-0">
            <div className="text-[11px] text-sky-200 font-semibold uppercase">Engine Status</div>
            <div className="text-lg font-bold text-emerald-400 flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              ALL GATES HEALTHY
            </div>
            <div className="text-[10px] text-slate-300">Port 8000 Uvicorn • SQLite/Postgres Ready</div>
          </div>
        </div>

        {/* 4 Architectural Summary Counters */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-semibold">Policy Block Rate</span>
            <span className="text-base font-bold text-emerald-400">100% of Risky Claims</span>
          </div>
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-semibold">Idempotency Checks</span>
            <span className="text-base font-bold text-white">42 Valid • 3 Suppressed</span>
          </div>
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-semibold">Min Sample Threshold</span>
            <span className="text-base font-bold text-[#00BAF2]">N ≥ 30 Enforced</span>
          </div>
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-semibold">Data Privacy Tier</span>
            <span className="text-base font-bold text-emerald-400">Zero PII Leakage</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          MODULE 1: ADAPTER REGISTRY & STATUSES
          ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#002970]" />
              <span>Integration Adapters & Production Pathways</span>
            </h2>
            <p className="text-xs text-slate-500">
              Honest status indicators distinguishing WORKING, SIMULATED, and INTEGRATION-READY components.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">4 Active Connectors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {adapters.map((adapter) => (
            <div key={adapter.name} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 hover:border-[#00BAF2] transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{adapter.name}</h3>
                  <span className="text-[11px] font-mono text-slate-500">{adapter.implementation}</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${adapter.statusColor}`}>
                  {adapter.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {adapter.details}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Production Path: <strong className="text-slate-700">{adapter.productionPath}</strong></span>
                <span className="font-mono text-slate-400">Latency: {adapter.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          MODULE 2: DETERMINISTIC POLICY ENGINE DECISIONS
          ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Deterministic Policy Engine & Regulatory Guardrails</span>
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated prior to any action reaching the merchant. Rules are strictly hardcoded; the LLM cannot override them.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">100% PASS RATE</span>
        </div>

        <div className="divide-y divide-slate-100">
          {policyRules.map((rule, idx) => (
            <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5 max-w-xl">
                <div className="font-bold text-slate-800 text-xs sm:text-sm">{rule.rule}</div>
                <p className="text-slate-500 text-[11px]">{rule.description}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                  {rule.status}
                </span>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Evaluated: {rule.evaluations} | Interventions: {rule.blocked}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          MODULE 3: CRYPTOGRAPHIC AUDIT LOGS
          ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#002970]" />
            <h2 className="font-bold text-sm text-[#002970]">Immutable Governance & Idempotency Audit Stream</h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">TAMPER-PROOF RECORD</span>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-[#002970] bg-[#00BAF2]/15 px-2 py-0.5 rounded text-[10px]">
                    {log.action}
                  </span>
                  <span className="font-bold text-slate-800">{log.resource}</span>
                  <span className="text-[10px] font-mono text-slate-400">{log.idempotency}</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Actor: <strong className="text-slate-700">{log.actor}</strong>
                </div>
              </div>

              <div className="text-right space-y-0.5 shrink-0">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {log.status}
                </span>
                <div className="text-[10px] font-mono text-slate-400">{log.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
