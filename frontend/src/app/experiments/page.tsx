'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Workflow, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sliders, 
  Award,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { api, ExperimentItem } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<ExperimentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    api.getExperiments()
      .then((data) => {
        setExperiments(data);
        setIsLoading(false);
      })
      .catch(() => {
        setExperiments([
          {
            id: "exp_afternoon_01",
            name: "Afternoon 2-5 PM Tea & Snack Booster",
            status: "RUNNING",
            hypothesis: "Offering 15% off tea+snack combos between 2-5 PM will convert low-footfall hours into ₹2,400 additional weekly volume.",
            baseline_metric: 212.0,
            target_metric: 248.0,
            current_metric: 242.0,
            start_date: "2026-09-20",
            end_date: "2026-09-27"
          },
          {
            id: "exp_weekend_02",
            name: "Weekend Morning Staples Bundle",
            status: "COMPLETED",
            hypothesis: "Bundling morning dairy and bread at ₹120 flat will increase average basket size by 14%.",
            baseline_metric: 185.0,
            target_metric: 210.0,
            current_metric: 216.5,
            start_date: "2026-09-10",
            end_date: "2026-09-17"
          }
        ]);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#002970] text-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full">
            <Workflow className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>{t("exp_badge", "COMMERCIAL EXPERIMENT REGISTRY")}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t("exp_title", "Live Growth Experiments")}
          </h1>
          <p className="text-xs text-sky-100">
            {t("exp_sub", "Tracking closed-loop hypotheses, control vs treatment, and measurable impact.")}
          </p>
        </div>

        <Link
          href="/simulator"
          className="bg-[#00BAF2] hover:bg-[#009ED0] text-[#002970] font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Sliders className="w-4 h-4" />
          <span>{t("nav_simulator", "Open Simulator")}</span>
        </Link>
      </div>

      {/* Experiments List */}
      <div className="grid grid-cols-1 gap-5">
        {experiments.map((exp) => {
          const isRunning = exp.status === 'RUNNING';
          const progressPct = Math.min(100, Math.round(((exp.current_metric - exp.baseline_metric) / (exp.target_metric - exp.baseline_metric || 1)) * 100));

          return (
            <div 
              key={exp.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-[#00BAF2] transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isRunning ? 'bg-sky-50 text-[#00BAF2] border border-[#00BAF2]/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {isRunning ? <TrendingUp className="w-5 h-5 text-[#00BAF2]" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isRunning ? 'bg-sky-100 text-[#002970]' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isRunning ? t("exp_running", "RUNNING") : t("exp_completed", "COMPLETED")}
                      </span>
                      <span className="text-xs font-mono text-slate-400">ID: {exp.id}</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-0.5">{exp.name}</h2>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t("exp_target", "Target Lift")}</span>
                  <span className="text-sm font-black text-[#002970]">
                    {exp.target_metric} <span className="text-xs font-normal text-slate-500">txns/day</span>
                  </span>
                </div>
              </div>

              {/* Hypothesis */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  {t("exp_hypothesis", "Hypothesis")}
                </span>
                <p className="text-slate-700 leading-relaxed font-medium">"{exp.hypothesis}"</p>
              </div>

              {/* Progress metrics */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t("exp_baseline", "Baseline")}</span>
                  <span className="text-sm font-bold text-slate-700">{exp.baseline_metric}</span>
                </div>
                <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-100">
                  <span className="text-[10px] text-[#002970] uppercase font-bold block">{t("exp_current", "Current")}</span>
                  <span className="text-sm font-black text-[#00BAF2]">{exp.current_metric}</span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">{t("exp_target", "Target")}</span>
                  <span className="text-sm font-black text-emerald-800">{exp.target_metric}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
