'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Sliders
} from 'lucide-react';
import { api, GrowthPlanData } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function GrowthPlanPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [plan, setPlan] = useState<GrowthPlanData | null>(null);
  const [approvedItems, setApprovedItems] = useState<Record<string, boolean>>({});
  const [approvingAll, setApprovingAll] = useState(false);

  useEffect(() => {
    api.getGrowthPlan(5000).then(setPlan);
  }, []);

  const handleApproveSingle = async (recId: string) => {
    setApprovedItems(prev => ({ ...prev, [recId]: true }));
    try {
      await api.approveRecommendation(recId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveAll = async () => {
    setApprovingAll(true);
    try {
      if (plan) {
        for (const item of plan.recommended_experiments) {
          await api.approveRecommendation(item.recommendation_id);
        }
      }
      setTimeout(() => {
        router.push('/execution');
      }, 500);
    } catch (e) {
      router.push('/execution');
    }
  };

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#00BAF2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStepTitle = (idx: number, fallback: string) => {
    if (idx === 0) return t('opp_afternoon_title', fallback);
    if (idx === 1) return t('opp_dormant_title', fallback);
    if (idx === 2) return t('opp_basket_title', fallback);
    return fallback;
  };

  const getStepDesc = (idx: number, fallback: string) => {
    if (idx === 0) return t('opp_afternoon_desc', fallback);
    if (idx === 1) return t('opp_dormant_desc', fallback);
    if (idx === 2) return t('opp_basket_desc', fallback);
    return fallback;
  };

  const approvedCount = Object.values(approvedItems).filter(Boolean).length;
  const currentProgress = approvedCount > 0 ? (approvedCount * 1700) : 0;
  const progressPct = Math.min(Math.round((currentProgress / plan.goal.target_revenue) * 100), 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Goal Summary Card */}
      <div className="bg-[#002970] text-white p-6 sm:p-7 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>{t("growth_plan_title", "Weekly Growth Plan")}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'hi' ? 'लक्ष्य: ₹5,000 अतिरिक्त आय' : language === 'mr' ? 'उद्दिष्ट: ₹5,000 अतिरिक्त उत्पन्न' : 'Target Goal: ₹5,000 Extra Volume'}
            </h1>
            <p className="text-xs text-sky-100 mt-1">
              {t("growth_plan_sub", "Rajesh ji, 3 prioritized actions to achieve your extra ₹5,000 revenue target:")}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-sky-200 block">{t("progress_label", "Total Planned Headroom")}</span>
            <span className="text-2xl font-black text-[#00BAF2]">₹6,200</span>
          </div>
        </div>

        {/* Progress Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-sky-100">
            <span>{t("planned_value", "Total Planned Value: ₹6,200 (+₹1,200 buffer over target)")}</span>
            <span className="font-bold text-emerald-400">124% {language === 'hi' ? 'कवर' : language === 'mr' ? 'कव्हर' : 'Covered'}</span>
          </div>
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
            <div className="bg-[#00BAF2] h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-slate-300">
            {t("plan_ready_msg", "3 structured experiments awaiting merchant cryptographic approval")}
          </span>
          <button
            onClick={handleApproveAll}
            disabled={approvingAll}
            className="px-5 py-2.5 bg-[#00BAF2] hover:bg-[#009ED0] text-[#002970] font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{approvingAll ? 'Executing...' : t("approve_plan_btn", "Approve & Execute Growth Plan")}</span>
          </button>
        </div>
      </div>

      {/* 3 Step Actions */}
      <div className="space-y-4">
        {plan.recommended_experiments.map((step, idx) => {
          const isApproved = approvedItems[step.recommendation_id];
          return (
            <div
              key={step.recommendation_id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 transition shadow-sm space-y-3 ${
                isApproved ? 'border-[#00A37A] bg-emerald-50/20' : 'border-slate-200 hover:border-[#00BAF2]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#002970] text-white flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </span>
                  <h2 className="font-bold text-sm text-slate-900">
                    {getStepTitle(idx, step.title)}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    +₹{step.estimated_opportunity.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    {step.duration}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {getStepDesc(idx, step.objective)}
              </p>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{language === 'hi' ? 'लक्षित ग्राहक:' : language === 'mr' ? 'लक्षित ग्राहक:' : 'Target Cohort:'}</span>
                  <span className="font-semibold text-slate-800">{step.target}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{language === 'hi' ? 'जोखिम मूल्यांकन:' : language === 'mr' ? 'जोखीम मूल्यांकन:' : 'Risk Factor:'}</span>
                  <span className="text-emerald-700 font-semibold">{step.risk}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/simulator"
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#00BAF2]" />
                  <span>{language === 'hi' ? 'सिमुलेटर में बदलें' : language === 'mr' ? 'सिम्युलेटरमध्ये बदला' : 'Simulate Details'}</span>
                </Link>

                <button
                  onClick={() => handleApproveSingle(step.recommendation_id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isApproved
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-[#002970] hover:bg-[#001D4F] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isApproved ? (language === 'hi' ? 'स्वीकृत' : language === 'mr' ? 'मंजूर' : 'Approved') : (language === 'hi' ? 'स्वीकृत करें' : language === 'mr' ? 'मंजूर करा' : 'Approve Step')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
