'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  BrainCircuit, 
  Users
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api, ExperimentResultData } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function ResultsPage() {
  const [data, setData] = useState<ExperimentResultData | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    api.getExperimentResults()
      .then(setData)
      .catch(() => {});
  }, []);

  const comparisonData = [
    { metric: language === 'hi' ? 'लेन-देन' : language === 'mr' ? 'व्यवहार' : 'Transactions', baseline: 212, actual: 248 },
    { metric: language === 'hi' ? 'औसत बिल (₹)' : language === 'mr' ? 'सरासरी बिल (₹)' : 'Avg Basket (₹)', baseline: 85, actual: 138 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A37A] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00A37A]" />
            <span>{language === 'hi' ? 'सत्यापित परिणाम • सांख्यिकीय रूप से सिद्ध' : language === 'mr' ? 'सत्यापित निकाल • सांख्यिकीय सिद्ध' : 'MEASURED OUTCOME • STATISTICALLY SIGNIFICANT'}</span>
          </div>
          <h1 className="text-2xl font-black text-[#002970] tracking-tight">
            {t("results_title", "Experiment Results & Impact")}
          </h1>
          <p className="text-xs text-slate-500">
            {t("results_sub", "Post-pilot performance for 14-day afternoon combo experiment")}
          </p>
        </div>

        <Link
          href="/memory"
          className="px-4 py-2 rounded-xl bg-[#002970] text-white text-xs font-bold hover:bg-[#001D4F] transition flex items-center gap-1.5 shadow-sm"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-[#00BAF2]" />
          <span>{t("save_to_memory_btn", "Commit to Memory")}</span>
        </Link>
      </div>

      {/* Hero Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">{t("result_txns", "Incremental Txns")}</span>
          <div className="text-2xl font-black text-[#00A37A] flex items-center gap-1">
            +17.0%
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500">248 vs 212 {language === 'hi' ? 'आधार' : language === 'mr' ? 'पायाभूत' : 'baseline'}</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">{t("result_revenue", "Incremental Revenue")}</span>
          <div className="text-2xl font-black text-[#00BAF2]">
            +₹5,100
          </div>
          <span className="text-xs text-slate-500">{language === 'hi' ? 'सत्यापित बिक्री' : language === 'mr' ? 'सत्यापित विक्री' : 'Verified payment volume'}</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">{t("result_profit", "Net Profit Uplift")}</span>
          <div className="text-2xl font-black text-[#002970]">
            +9.2%
          </div>
          <span className="text-xs text-slate-500">{language === 'hi' ? 'छूट बाद शुद्ध लाभ' : language === 'mr' ? 'सवलतीनंतर निव्वळ नफा' : 'Post-discount contribution'}</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">{t("result_stat_sig", "Stat Confidence")}</span>
          <div className="text-2xl font-black text-emerald-700 flex items-center gap-1">
            96.0%
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500">p &lt; 0.04 ({language === 'hi' ? 'विश्वसनीय' : language === 'mr' ? 'विश्वासार्ह' : 'Reliable'})</span>
        </div>
      </div>

      {/* Chart & Learnings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-[#002970]">
            {language === 'hi' ? 'आधार बनाम वास्तविक परिणाम' : language === 'mr' ? 'पायाभूत विरुद्ध प्रत्यक्ष निकाल' : 'Baseline vs Experiment Actuals'}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
                <Bar dataKey="baseline" fill="#94A3B8" name={language === 'hi' ? 'आधार' : language === 'mr' ? 'पायाभूत' : 'Baseline'} radius={[6, 6, 0, 0]} />
                <Bar dataKey="actual" fill="#00BAF2" name={language === 'hi' ? 'ग्रोथओएस के साथ' : language === 'mr' ? 'ग्रोथओएस सह' : 'With GrowthOS'} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dormant Re-engagement Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#002970]">
              <Users className="w-5 h-5 text-[#00BAF2]" />
              <h3 className="font-bold text-sm">{t("result_dormant_reactivated", "29 Reactivated Shoppers")}</h3>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">{language === 'hi' ? 'वापस आए नियमित ग्राहक' : language === 'mr' ? 'परत आलेले ग्राहक' : 'Reactivated Customers'}</span>
              <div className="text-2xl font-black text-[#002970]">
                29 {language === 'hi' ? 'ग्राहक' : language === 'mr' ? 'ग्राहक' : 'Shoppers'}
              </div>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? '47 लक्षित निष्क्रिय ग्राहकों में से' : language === 'mr' ? '47 लक्षित निष्क्रिय ग्राहकांपैकी' : 'Out of 47 dormant regulars targeted via WhatsApp vouchers.'}
              </p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("result_learning_1")}
            </p>
          </div>

          <Link
            href="/customers"
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition text-center block"
          >
            {t("nav_customers", "View Customer Cohorts")}
          </Link>
        </div>
      </div>
    </div>
  );
}
