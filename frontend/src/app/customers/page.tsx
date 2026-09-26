'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

export default function CustomersPage() {
  const { language, t } = useLanguage();

  const segments = [
    { segment: language === 'hi' ? 'नए' : language === 'mr' ? 'नवीन' : 'New', count: 650, avg_basket: 145.0, avg_txns: 1.4 },
    { segment: language === 'hi' ? 'नियमित' : language === 'mr' ? 'नियमित' : 'Repeat', count: 600, avg_basket: 195.0, avg_txns: 7.2 },
    { segment: language === 'hi' ? 'उच्च मूल्य' : language === 'mr' ? 'उच्च मूल्य' : 'High Value', count: 350, avg_basket: 420.0, avg_txns: 18.5 },
    { segment: language === 'hi' ? 'निष्क्रिय' : language === 'mr' ? 'निष्क्रिय' : 'Dormant', count: 47, avg_basket: 312.0, avg_txns: 5.8 }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002970] bg-[#00BAF2]/15 px-2.5 py-0.5 rounded-full">
            <Users className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>{t("nav_customers", "Privacy-Preserving RFM Engine")}</span>
          </div>
          <h1 className="text-2xl font-black text-[#002970] tracking-tight">
            {t("customers_title", "Customer Cohorts & Retention")}
          </h1>
          <p className="text-xs text-slate-500">
            {t("customers_sub", "Privacy-safe aggregated cohort signals. Zero customer PII is transmitted or exposed.")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#00A37A] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero PII Compliant</span>
          </span>
        </div>
      </div>

      {/* Dormant Alert Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-sm text-amber-900">
              {t("dormant_alert_title", "47 High-Value Regulars in Danger of Churning (78% Churn Risk)")}
            </h2>
            <p className="text-xs text-amber-800 leading-relaxed">
              {language === 'hi' ? 'ये ग्राहक औसतन ₹312 खर्च करते थे, लेकिन पिछले 21 दिनों से स्टोर पर नहीं आए हैं।' : language === 'mr' ? 'हे ग्राहक सरासरी ₹312 खर्च करत होते, परंतु मागील 21 दिवसांपासून आलेले नाहीत.' : 'These shoppers used to spend ₹312 on average, but have not transacted in over 21 days.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => alert(language === 'hi' ? '47 निष्क्रिय ग्राहकों को व्हाट्सएप कूपन वाउचर भेजा गया!' : language === 'mr' ? '47 निष्क्रिय ग्राहकांना व्हॉट्सअॅप कूपन पाठवले!' : 'WhatsApp win-back pilot dispatched to 47 dormant numbers via Paytm mock provider!')}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 flex-shrink-0"
        >
          <span>{t("launch_winback_btn", "Launch ₹30 WhatsApp Campaign")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cohort Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {segments.map((seg) => (
          <div
            key={seg.segment}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 hover:border-[#00BAF2] transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#002970] bg-[#00BAF2]/15 px-2.5 py-0.5 rounded-full">
                {seg.segment}
              </span>
              <span className="text-xs font-black text-slate-900">
                {seg.count} {language === 'hi' ? 'ग्राहक' : language === 'mr' ? 'ग्राहक' : 'Shoppers'}
              </span>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{language === 'hi' ? 'औसत बिल:' : language === 'mr' ? 'सरासरी बिल:' : 'Avg Basket:'}</span>
                <span className="font-bold text-slate-900">₹{seg.avg_basket}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'hi' ? 'औसत लेन-देन:' : language === 'mr' ? 'सरासरी व्यवहार:' : 'Avg Txns:'}</span>
                <span className="font-bold text-slate-900">{seg.avg_txns}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
