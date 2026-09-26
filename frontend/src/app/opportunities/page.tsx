'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Target, 
  Clock, 
  Users, 
  ShoppingBag, 
  Calendar, 
  ArrowRight, 
  Info, 
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Sliders,
  Layers,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { api, OpportunitySpaceData } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function OpportunitiesPage() {
  const [data, setData] = useState<OpportunitySpaceData | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    api.getOpportunities().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#00BAF2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getOppTitle = (code: string, fallback: string) => {
    if (code === 'AFTERNOON_DEMAND') return t('opp_afternoon_title', fallback);
    if (code === 'DORMANT_WINBACK') return t('opp_dormant_title', fallback);
    if (code === 'BASKET_SIZE') return t('opp_basket_title', fallback);
    if (code === 'WEEKEND_BOOST') return t('opp_weekend_title', fallback);
    return fallback;
  };

  const getOppDesc = (code: string, fallback: string) => {
    if (code === 'AFTERNOON_DEMAND') return t('opp_afternoon_desc', fallback);
    if (code === 'DORMANT_WINBACK') return t('opp_dormant_desc', fallback);
    if (code === 'BASKET_SIZE') return t('opp_basket_desc', fallback);
    if (code === 'WEEKEND_BOOST') return t('opp_weekend_desc', fallback);
    return fallback;
  };

  const getOppAction = (code: string, fallback: string) => {
    if (code === 'AFTERNOON_DEMAND') return t('opp_afternoon_action', fallback);
    if (code === 'DORMANT_WINBACK') return t('opp_dormant_action', fallback);
    if (code === 'BASKET_SIZE') return t('opp_basket_action', fallback);
    if (code === 'WEEKEND_BOOST') return t('opp_weekend_action', fallback);
    return fallback;
  };

  const getOppBadge = (code: string, fallback: string) => {
    if (code === 'AFTERNOON_DEMAND') return t('opp_afternoon_badge', fallback);
    if (code === 'DORMANT_WINBACK') return t('opp_dormant_badge', fallback);
    if (code === 'BASKET_SIZE') return t('opp_basket_badge', fallback);
    if (code === 'WEEKEND_BOOST') return t('opp_weekend_badge', fallback);
    return fallback;
  };

  const economics = [
    {
      code: 'AFTERNOON_DEMAND',
      gross: 2400,
      overlap_factor: '15.0%',
      addressable: 2040,
      discount_cost: 420,
      net_contrib: 1462,
      why_action: language === 'hi' ? 'चाय और समोसा में 74% को-परचेज सहसंबंध है' : language === 'mr' ? 'चहा आणि समोसा मध्ये 74% एकत्रित खरेदी संबंध आहे' : '74% co-purchase affinity between tea and hot snacks',
      why_not_discount: language === 'hi' ? 'सपाट छूट से सुबह के नियमित ग्राहकों का मार्जिन कटता है' : language === 'mr' ? 'सपाट सवलतीमुळे सकाळच्या नियमित ग्राहकांचे मार्जिन कमी होते' : 'Flat discount cannibalizes full-price morning regulars'
    },
    {
      code: 'DORMANT_WINBACK',
      gross: 2100,
      overlap_factor: '18.0%',
      addressable: 1722,
      discount_cost: 210,
      net_contrib: 1392,
      why_action: language === 'hi' ? '47 वफादार नियमित ग्राहकों का चर्न जोखिम 78% है' : language === 'mr' ? '47 निष्ठावंत नियमित ग्राहकांचा चर्न जोखीम 78% आहे' : '47 high-value regulars at 78% churn probability',
      why_not_discount: language === 'hi' ? 'सिर्फ ₹30 कूपन से ₹300+ बास्केट एक्टिवेट होती है' : language === 'mr' ? 'फक्त ₹30 कूपनने ₹300+ बास्केट सक्रिय होते' : 'Targeted ₹30 welcome-back requires ₹300 basket threshold'
    },
    {
      code: 'BASKET_SIZE',
      gross: 1700,
      overlap_factor: '14.0%',
      addressable: 1462,
      discount_cost: 160,
      net_contrib: 1148,
      why_action: language === 'hi' ? 'किराना और बिस्कुट का काउंटर डिस्प्ले बास्केट साइज बढ़ाता है' : language === 'mr' ? 'किराणा आणि बिस्किट काउंटर डिस्प्ले बास्केट वाढवतो' : 'Counter display expands impulse confectionery add-ons',
      why_not_discount: language === 'hi' ? 'मार्जिन की रक्षा के लिए बंडलिंग बेहतर है' : language === 'mr' ? 'मार्जिन रक्षणासाठी बंडलिंग अधिक फायदेशीर आहे' : 'Bundle prevents individual margin dilution'
    },
    {
      code: 'WEEKEND_BOOST',
      gross: 1200,
      overlap_factor: '22.0%',
      addressable: 904,
      discount_cost: 100,
      net_contrib: 826,
      why_action: language === 'hi' ? 'शनिवार-रविवार सुबह पारिवारिक राशन खरीदारी 24% अधिक होती है' : language === 'mr' ? 'शनिवार-रविवार सकाळी कौटुंबिक किराणा खरेदी 24% जास्त असते' : 'Saturday-Sunday grocery restocking surges +24%',
      why_not_discount: language === 'hi' ? '₹300 न्यूनतम सीमा से छोटा बिल छूट नहीं पाता' : language === 'mr' ? '₹300 किमान अटीमुळे लहान बिलावर सवलत जात नाही' : 'Restricted strictly to ₹300+ family pantry baskets'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Header Banner with Overlap Deduplication */}
      <div className="bg-[#002970] text-white p-6 sm:p-7 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200 bg-white/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>{t("nav_opportunities", "Opportunity Engine")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {language === 'hi' ? '₹6,128 वास्तविक विकास संभावना' : language === 'mr' ? '₹6,128 प्रत्यक्ष वाढीची संधी' : '₹6,128 ADDRESSABLE GROWTH HEADROOM'}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl leading-relaxed">
              Gross potential of ₹7,400 across 4 telemetry vectors deduplicated by 17.2% to prevent double-counting shared shoppers.
            </p>
          </div>

          <Link
            href="/growth-plan"
            className="bg-[#00BAF2] hover:bg-[#009ED0] text-[#002970] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow transition flex items-center justify-center gap-2 self-start md:self-auto shrink-0"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t("formulate_plan_btn", "Build My Growth Plan")}</span>
          </Link>
        </div>

        {/* Deduplication Summary Metrics Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-semibold">Gross Opportunity</span>
            <span className="text-base font-bold text-white">₹7,400 / wk</span>
          </div>
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-semibold">Overlap Deduplication</span>
            <span className="text-base font-bold text-amber-300">-₹1,272 (-17.2%)</span>
          </div>
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-semibold">Addressable Upside</span>
            <span className="text-base font-bold text-[#00BAF2]">₹6,128 / wk</span>
          </div>
          <div>
            <span className="text-slate-300 block text-[10px] uppercase font-semibold">Net Contribution</span>
            <span className="text-base font-bold text-emerald-400">+₹4,828 / wk</span>
          </div>
        </div>
      </div>

      {/* Explanatory Callout Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3 text-xs text-[#002970]">
        <Info className="w-5 h-5 text-[#00BAF2] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">
            {language === 'hi' 
              ? 'सांख्यिकीय ओवरलैप क्या है और यह क्यों आवश्यक है?' 
              : language === 'mr' 
              ? 'सांख्यिकीय ओवरलॅप काय आहे आणि ते का आवश्यक आहे?' 
              : 'Why Statistical Deduplication Matters For Merchant Profit:'}
          </div>
          <p className="text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'यदि कोई व्यापारी दोपहर में चाय पर 15% छूट और उसी समय समोसा कॉम्बो ऑफर चलाता है, तो दोनों प्रचार एक ही ग्राहक वर्ग को आकर्षित करते हैं। सीधे जोड़ने से संभावित लाभ का गलत अनुमान लगता है। ग्रोथओएस वास्तविक मार्जिन की गणना करता है।'
              : language === 'mr'
              ? 'दुपारी चहावर 15% सवलत आणि त्याच वेळी समोसा कॉम्बो चालवल्यास दोन्ही एकाच ग्राहकांना लक्ष्य करतात. थेट बेरीज केल्यास नफ्याचा अतिशयोक्त अंदाज येतो. ग्रोथओएस वास्तविक नफ्याची अचूक गणना करते.'
              : 'Running an afternoon tea discount alongside an afternoon snack bundle targets the same footfall stream. Blindly summing their individual headroom would inflate expectations. GrowthOS applies cross-vector overlap factors (14% - 22%) to ensure honest commercial planning.'}
          </p>
        </div>
      </div>

      {/* Grid of 4 Detailed Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.opportunities.map((opp) => {
          const econ = economics.find(e => e.code === opp.opportunity_code) || economics[0];

          return (
            <div
              key={opp.opportunity_id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between hover:border-[#00BAF2] transition space-y-4"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002970] bg-[#00BAF2]/15 px-2.5 py-0.5 rounded-full font-mono">
                    {getOppBadge(opp.opportunity_code, opp.category)}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      +{opp.estimated_opportunity.label} Gross
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-snug">
                    {getOppTitle(opp.opportunity_code, opp.title)}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {getOppDesc(opp.opportunity_code, opp.explanation)}
                  </p>
                </div>

                {/* Economics Strip */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Addressable</span>
                    <span className="font-bold text-slate-800">₹{econ.addressable}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Discount Cost</span>
                    <span className="font-bold text-rose-600">-₹{econ.discount_cost}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Net Contribution</span>
                    <span className="font-bold text-emerald-600">+₹{econ.net_contrib}</span>
                  </div>
                </div>

                {/* Action Box */}
                <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-[#002970]">
                    {language === 'hi' ? 'अनुशंसित अगला कदम:' : language === 'mr' ? 'पुढील शिफारस कृती:' : 'Next Best Action:'}
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {getOppAction(opp.opportunity_code, opp.recommended_action.offer_title || opp.recommended_action.offer_spec)}
                  </div>
                </div>

                {/* Why This & Why Not Discount */}
                <div className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-800 shrink-0">Why this action:</span>
                    <span>{econ.why_action}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-rose-700 shrink-0">Why not flat discount:</span>
                    <span>{econ.why_not_discount}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href="/simulator"
                  className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#00BAF2]" />
                  <span>{language === 'hi' ? 'सिमुलेटर में जांचें' : language === 'mr' ? 'सिम्युलेटरमध्ये तपासा' : 'Simulate in Sandbox'}</span>
                </Link>

                <Link
                  href={`/opportunities/${opp.opportunity_id}`}
                  className="font-bold text-[#002970] hover:text-[#00BAF2] flex items-center gap-1"
                >
                  <span>{t("review_action_btn", "Review Action")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
