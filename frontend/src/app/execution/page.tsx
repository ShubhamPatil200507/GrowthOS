'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  Workflow, 
  Play, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  QrCode, 
  MessageSquare, 
  ArrowRight,
  RefreshCw,
  Terminal
} from 'lucide-react';

interface Step {
  id: number;
  name: string;
  channel: string;
  status: 'pending' | 'running' | 'completed';
  detail: string;
  icon: any;
}

export default function ExecutionPage() {
  const [isRunning, setIsRunning] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      name: "Safety & Margin Guardrail Verification",
      channel: "GrowthOS Safe Engine",
      status: "completed",
      detail: "Verified: Afternoon 15% discount maintains gross margin > 18.4%. Compliant with merchant bounds.",
      icon: ShieldCheck
    },
    {
      id: 2,
      name: "Dormant Regulars Cohort Generation",
      channel: "Customer RFM Engine",
      status: "completed",
      detail: "47 dormant customers selected. Privacy hashes verified. Zero raw PII transmitted.",
      icon: MessageSquare
    },
    {
      id: 3,
      name: "Paytm Merchant Voucher Creation",
      channel: "Paytm Provider Interface",
      status: "completed",
      detail: "Created voucher AFTERNOON15 valid 2:00 PM - 5:00 PM on orders >= ₹100.",
      icon: CheckCircle2
    },
    {
      id: 4,
      name: "Counter QR Collateral Generation",
      channel: "Paytm QR & Display",
      status: "running",
      detail: "Generated high-res table-top QR flyer: Afternoon Tea & Snacks 15% Off.",
      icon: QrCode
    },
    {
      id: 5,
      name: "Paytm Soundbox Voice Prompt Dispatch",
      channel: "Soundbox Audio Engine (Sarvam)",
      status: "pending",
      detail: "Marathi/Hindi audio prompt queued for afternoon store broadcast on 2:00 PM trigger.",
      icon: Volume2
    },
    {
      id: 6,
      name: "Register Active 7-Day Growth Experiment",
      channel: "Experimentation Tracker",
      status: "pending",
      detail: "Experiment #EXP-772 created. Baseline: 212 afternoon txns. Target: 248 txns (+17%).",
      icon: Workflow
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 6) {
          const next = prev + 1;
          setSteps((currentSteps) =>
            currentSteps.map((step) => {
              if (step.id < next) return { ...step, status: 'completed' };
              if (step.id === next) return { ...step, status: 'running' };
              return step;
            })
          );
          return next;
        } else {
          setSteps((currentSteps) =>
            currentSteps.map((s) => ({ ...s, status: 'completed' }))
          );
          setIsRunning(false);
          clearInterval(timer);
          return 6;
        }
      });
    }, 1400);

    return () => clearInterval(timer);
  }, []);

  const handleRerun = () => {
    setActiveStep(1);
    setIsRunning(true);
    setSteps((currentSteps) =>
      currentSteps.map((s, idx) => ({
        ...s,
        status: idx === 0 ? 'completed' : idx === 1 ? 'running' : 'pending'
      }))
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E0EFF7] shadow-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002970] bg-[#00BAF2]/15 px-2.5 py-0.5 rounded-full">
            <Workflow className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>HUMAN-IN-THE-LOOP ORCHESTRATION</span>
          </div>
          <h1 className="text-2xl font-black text-[#002970] tracking-tight">
            Workflow Execution Pipeline
          </h1>
          <p className="text-xs text-slate-500">
            Automated multi-channel dispatch via n8n automation adapter & Paytm Provider interfaces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRerun}
            disabled={isRunning}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>Re-run Pipeline</span>
          </button>
          <Link
            href="/experiments"
            className="px-4 py-2 rounded-xl bg-[#002970] text-white text-xs font-bold hover:bg-[#001d52] transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Active Experiments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Progress banner */}
      <div className="bg-gradient-to-r from-[#002970] to-[#00BAF2] rounded-2xl p-6 text-white space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-[#00BAF2] tracking-wider uppercase">
              Action Execution Status
            </span>
            <h2 className="text-lg font-bold">
              {isRunning ? 'Executing Approved Growth Workflow...' : 'All 6 Stages Successfully Dispatched!'}
            </h2>
          </div>
          <span className="text-2xl font-black">{Math.round((activeStep / 6) * 100)}%</span>
        </div>
        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-700 ease-out"
            style={{ width: `${(activeStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* 6 Stage Stepper */}
      <div className="space-y-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all ${
                step.status === 'completed'
                  ? 'border-[#00A37A]/30 bg-[#F0FDF4]/30'
                  : step.status === 'running'
                  ? 'border-[#00BAF2] ring-2 ring-[#00BAF2]/20 shadow-md'
                  : 'border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    step.status === 'completed'
                      ? 'bg-[#00A37A] text-white'
                      : step.status === 'running'
                      ? 'bg-[#00BAF2] text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span>{step.id}. {step.name}</span>
                    </h3>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      {step.channel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.detail}</p>
                </div>

                <div className="flex-shrink-0 pt-1">
                  {step.status === 'completed' && (
                    <span className="text-[11px] font-bold text-[#00A37A] bg-[#00A37A]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  )}
                  {step.status === 'running' && (
                    <span className="text-[11px] font-bold text-[#00BAF2] bg-[#00BAF2]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-[#00BAF2] border-t-transparent rounded-full animate-spin" /> In Progress
                    </span>
                  )}
                  {step.status === 'pending' && (
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      Queued
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit Log Card */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3 font-mono text-xs shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-4 h-4 text-[#00BAF2]" />
            <span className="font-bold">Execution Dispatch Audit Log</span>
          </div>
          <span className="text-[10px] text-slate-500">ID: DISPATCH-78812</span>
        </div>
        <div className="space-y-1 text-[11px] leading-relaxed text-slate-300">
          <div>[2026-09-26 14:02:11] APPROVED by merchant MERCH_PUNE_001 (Rajesh Kumar)</div>
          <div>[2026-09-26 14:02:12] SAFE_LANG_CHECK: OK (Zero prohibited financial promises)</div>
          <div>[2026-09-26 14:02:13] PAYTM_PROV: Voucher AFTERNOON15 created on test merchant account</div>
          <div>[2026-09-26 14:02:14] SOUNDBOX: Audio payload dispatched to Pune store terminal #SB-4401</div>
          <div>[2026-09-26 14:02:15] EXPERIMENT: Registered #EXP-772 with target uplift +₹2,400</div>
        </div>
      </div>
    </div>
  );
}
