'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CheckCircle2, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function ConsentPage() {
  const { t } = useLanguage();
  const [consents, setConsents] = useState<any>({
    business_analytics: true,
    customer_segmentation: true,
    personalized_campaigns: true,
    voice_processing: true,
    external_ai: true,
    data_retention_days: 90
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    api.getConsent().then((res) => {
      if (res && res.consents) {
        setConsents(res.consents);
      }
    });
  }, []);

  const handleToggle = (key: string) => {
    setConsents((prev: any) => ({ ...prev, [key]: !prev[key] }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await api.updateConsent(consents);
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-[#002970] text-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full">
            <Lock className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>DATA GOVERNANCE & PRIVACY</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t("nav_consent", "Merchant Privacy & Consent Center")}
          </h1>
          <p className="text-xs text-sky-100 max-w-xl">
            GrowthOS operates under a zero-PII, merchant-controlled data standard. Configure granular permissions for store analytics and campaign dispatch.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 text-xs text-sky-100 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-[#00BAF2]" />
          <span>Zero PII to LLMs</span>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Merchant privacy permissions updated successfully. Changes take effect immediately.</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        <div className="p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Store Analytics & Trend Detection</span>
              <span className="text-[10px] font-bold bg-sky-50 text-[#002970] px-2 py-0.5 rounded">Core Feature</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Allows GrowthOS to calculate hourly transaction density, baseline revenue, and product co-purchase affinities on your local store data.
            </p>
          </div>
          <button onClick={() => handleToggle("business_analytics")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition shrink-0 ${consents.business_analytics ? "bg-[#00BAF2]" : "bg-slate-200"}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${consents.business_analytics ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Privacy-Preserving Customer Cohorts</span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Pseudonymized</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Permits aggregate RFM segmentation (e.g. identifying 47 dormant regulars). Customer phone numbers and UPI IDs are never decrypted or passed to the AI.
            </p>
          </div>
          <button onClick={() => handleToggle("customer_segmentation")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition shrink-0 ${consents.customer_segmentation ? "bg-[#00BAF2]" : "bg-slate-200"}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${consents.customer_segmentation ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Simulated Campaign & Offer Dispatch</span>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">Human Authorized</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Allows staging of WhatsApp templates and Paytm QR discount standees. Every individual dispatch requires explicit merchant tap sign-off.
            </p>
          </div>
          <button onClick={() => handleToggle("personalized_campaigns")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition shrink-0 ${consents.personalized_campaigns ? "bg-[#00BAF2]" : "bg-slate-200"}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${consents.personalized_campaigns ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Voice Intent & Audio Synthesis</span>
              <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded">Multi-Dialect</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Enables merchant voice goal queries and Paytm Soundbox audio announcements in Hindi, Marathi, and English.
            </p>
          </div>
          <button onClick={() => handleToggle("voice_processing")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition shrink-0 ${consents.voice_processing ? "bg-[#00BAF2]" : "bg-slate-200"}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${consents.voice_processing ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">External AI & LLM Processing</span>
              <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded">Sanitized Context</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Allows sanitized prompt text to be processed by underlying reasoning models. If disabled, GrowthOS runs purely on deterministic local heuristics.
            </p>
          </div>
          <button onClick={() => handleToggle("external_ai")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition shrink-0 ${consents.external_ai ? "bg-[#00BAF2]" : "bg-slate-200"}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${consents.external_ai ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button onClick={handleSave} disabled={saving}
          className="bg-[#002970] hover:bg-[#001D4F] text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-[#00BAF2]" />
          <span>{saving ? "Saving Preferences..." : "Save Privacy Preferences"}</span>
        </button>
      </div>
    </div>
  );
}