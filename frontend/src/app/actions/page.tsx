'use client';

import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Workflow, 
  ShieldCheck, 
  AlertCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ActionsPage() {
  const [actions, setActions] = useState<any[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/actions')
      .then(res => res.json())
      .then(setActions)
      .catch(() => {
        setActions([
          {
            id: "act_01",
            action_type: "OFFER_CREATE",
            status: "SCHEDULED",
            target_segment: "Afternoon Visitors (2-5 PM)",
            offer_details: "₹20 off orders above ₹200",
            execution_engine: "DEMO_SIMULATOR",
            created_at: new Date().toISOString(),
            approvals: [{ decision: "APPROVED", by: "Rajesh Kumar (Merchant)", at: new Date().toISOString() }]
          },
          {
            id: "act_02",
            action_type: "CUSTOMER_WINBACK",
            status: "PENDING_APPROVAL",
            target_segment: "47 Dormant Regulars",
            offer_details: "₹30 welcome back coupon",
            execution_engine: "N8N_OR_SIMULATOR",
            created_at: new Date().toISOString(),
            approvals: []
          }
        ]);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#002970] text-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>{t("actions_badge", "HUMAN-IN-THE-LOOP AUDIT TRAIL")}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t("actions_title", "Action Center & Approvals")}
          </h1>
          <p className="text-xs text-sky-100">
            {t("actions_sub", "Immutable record of all merchant decisions, approved workflows, and execution logs.")}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 text-xs text-sky-100 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-[#00BAF2]" />
          <span>{t("audit_tamper_proof", "Tamper-Proof Audit Trail")}</span>
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        {actions.map((act) => (
          <div 
            key={act.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-[#00BAF2] transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  act.status === 'SCHEDULED' || act.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {act.status === 'SCHEDULED' || act.status === 'APPROVED' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">#{act.id.slice(0, 8)}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      act.status === 'SCHEDULED' || act.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {act.status === 'SCHEDULED' || act.status === 'APPROVED' ? t("status_scheduled", "SCHEDULED / APPROVED") : t("status_pending", "PENDING APPROVAL")}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{act.offer_details}</h3>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 block">{t("engine_label", "Execution Engine")}</span>
                <span className="text-xs font-bold text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded">
                  {act.execution_engine}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1 font-semibold uppercase">Target Segment</span>
                <p className="font-bold text-slate-800">{act.target_segment}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1 font-semibold uppercase">Merchant Sign-off</span>
                {act.approvals && act.approvals.length > 0 ? (
                  <p className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {act.approvals[0].by} • {new Date(act.approvals[0].at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                ) : (
                  <p className="font-bold text-amber-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Awaiting explicit merchant confirmation
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
