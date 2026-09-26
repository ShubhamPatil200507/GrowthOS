'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'hi' | 'mr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
  speakText: (text: string) => void;
  isSpeaking: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  hi: {
    // Top Bar & App Brand
    app_title: "पेटीएम ग्रोथओएस",
    app_subtitle: "पेटीएम व्यापारियों के लिए एआई बिजनेस पार्टनर",
    demo_mode: "डेमो मोड",
    demo_disclaimer: "ग्रोथओएस प्रोटोटाइप • पेटीएम मर्चेंट इकोसिस्टम के लिए डिज़ाइन किया गया",
    reset_demo: "डेमो रीसेट करें",
    jury_walkthrough: "10-स्टेप ज्यूरी डेमो",

    // Store & Header
    store_name: "राजेश जनरल स्टोर",
    store_location: "कोथरूड, पुणे • किराना एवं दैनिक सामग्री",
    verified_merchant: "सत्यापित मर्चेंट",
    soundbox_online: "पेटीएम साउंडबॉक्स 4.0 ऑनलाइन",
    soundbox_device: "4G VoLTE • डिवाइस #SB4-PUN-088",
    auto_settled_banner: "ऑटो-सेटलमेंट: ₹17,840.00 एचडीएफसी बैंक खाता •••• 4921 में सुबह 06:30 बजे जमा (UTR: 260906304912)",
    current_batch: "वर्तमान अनसेटल बैच: ₹580.00",
    next_settlement: "अगला सेटलमेंट: आज रात 11:30 बजे",

    // Dashboard KPIs
    todays_collections: "आज की कुल बिक्री",
    total_transactions: "कुल लेन-देन",
    average_ticket: "औसत बिल (AOV)",
    repeat_customers: "नियमित ग्राहक (Repeat)",
    payments_count: "पेमेंट्स",
    soundbox_voice_confirmed: "साउंडबॉक्स आवाज पुष्टि",
    peak_hours: "पीक समय: 6-9 PM (38/hr)",
    lull_hours: "मंदी का समय: 2-5 PM (₹480/hr)",
    first_time_shoppers: "नए ग्राहक: 35",
    dormant_alert_pill: "47 नियमित ग्राहक निष्क्रिय ⚠️",

    // Copilot & Command Desk
    copilot_title: "ग्रोथओएस बिजनेस सलाहकार",
    copilot_subtitle: "बोलकर या लिखकर सवाल पूछें (हिंग्लिश / हिंदी / मराठी समर्थित)",
    discovered_headroom: "पहचानी गई अतिरिक्त आय संभावना:",
    copilot_placeholder: "व्यापार का कोई भी सवाल पूछें (उदा. 'मुझे इस हफ्ते ₹5,000 एक्स्ट्रा कमाना है')...",
    analyze_btn: "विश्लेषण करें",
    listening: "सुन रहे हैं...",
    mic_label: "माइक",
    quick_queries: "त्वरित प्रश्न:",
    query_5000: "मुझे इस हफ्ते ₹5,000 एक्स्ट्रा कमाना है",
    query_lull: "दोपहर 2 से 5 PM के बीच बिक्री क्यों गिर रही है?",
    query_dormant: "47 पुराने नियमित ग्राहकों को वापस कैसे लाएं?",

    // Opportunities Page & Dashboard Cards
    opportunities_heading: "पहचाने गए व्यापारिक अवसर (₹7,400 / सप्ताह)",
    opportunities_sub: "12 हफ्तों के स्टोर डेटा विश्लेषण से 4 ठोस अवसर मिले",
    formulate_plan_btn: "₹5,000 ग्रोथ प्लान बनाएं",
    review_action_btn: "कार्यवाही देखें",
    opp_space_identified: "₹7,400 की ग्रोथ संभावना उपलब्ध",
    opp_space_sub: "स्टोर डेटा की निगरानी से पहचाने गए 4 प्रमुख अवसर",

    opp_afternoon_title: "दोपहर 2-5 PM चाय-नाश्ता बूस्टर ऑफर",
    opp_afternoon_desc: "दोपहर में ग्राहकों की संख्या 68% घट जाती है (₹480/घंटा बनाम ₹2,800 पीक)। फिक्स्ड किराया व बिजली खर्च वही रहता है।",
    opp_afternoon_action: "₹100 से ऊपर के ऑर्डर पर चाय+समोसा कॉम्बो में 15% छूट का वाउचर दें",
    opp_afternoon_badge: "दोपहर मंदी निवारण",

    opp_dormant_title: "47 पुराने नियमित ग्राहकों को वापस लाएं",
    opp_dormant_desc: "47 अच्छे नियमित ग्राहक (औसत बिल ₹312) पिछले 21 दिनों से स्टोर पर नहीं आए हैं।",
    opp_dormant_action: "पेटीएम व्हाट्सएप पर ₹30 का वेलकम-बैक डिस्काउंट वाउचर भेजें",
    opp_dormant_badge: "ग्राहक वफादारी",

    opp_basket_title: "चाय + समोसा कॉम्बो क्रॉस-सेल बंडल",
    opp_basket_desc: "डेटा बताता है कि 74% मामलों में चाय पीने वाले समोसा भी साथ खरीदते हैं।",
    opp_basket_action: "बिलिंग काउंटर पर कॉम्बो क्यूआर स्टैंडी लगाएं",
    opp_basket_badge: "बिल वृद्धि",

    opp_weekend_title: "वीकेंड किराना बंडल ऑफर",
    opp_weekend_desc: "शनिवार और रविवार सुबह राशन व घरेलू सामान की खरीदारी 24% अधिक होती है।",
    opp_weekend_action: "₹300 से ऊपर की खरीदारी पर ₹20 की सीधी छूट दें",
    opp_weekend_badge: "वीकेंड सेल",

    // Growth Plan Page
    growth_plan_title: "साप्ताहिक ग्रोथ प्लान (लक्ष्य: ₹5,000)",
    growth_plan_sub: "राजेश जी, आपका ₹5,000 का लक्ष्य प्राप्त करने के लिए 3 प्राथमिकता वाले कार्य:",
    progress_label: "लक्ष्य प्राप्ति संभावना",
    planned_value: "कुल संभावित आय: ₹6,200 (लक्ष्य से ₹1,200 अधिक)",
    approve_plan_btn: "ग्रोथ प्लान स्वीकृत करें एवं शुरू करें",
    plan_ready_msg: "3 चरणबद्ध प्रयोग मर्चेंट अनुमोदन के लिए तैयार हैं",

    // Simulator Page
    simulator_title: "ग्रोथ परिदृश्य सिमुलेटर (What-If Analysis)",
    simulator_sub: "छूट प्रतिशत, समय सीमा और न्यूनतम बिल राशि बदलकर लाभ का पूर्वानुमान लगाएं",
    param_discount: "प्रचार छूट प्रतिशत",
    param_hours: "लक्षित समय सीमा (घंटे)",
    param_min_cart: "न्यूनतम बिल राशि",
    param_duration: "अभियान अवधि (दिन)",
    proj_volume: "अनुमानित अतिरिक्त ग्राहक",
    proj_revenue: "अनुमानित सकल बिक्री",
    proj_net_profit: "अनुमानित शुद्ध लाभ",
    risk_low: "कम जोखिम (सुरक्षित मार्जिन)",
    risk_moderate: "मध्यम जोखिम",
    apply_plan_btn: "ग्रोथ प्लान में लागू करें",

    // Results Page
    results_title: "प्रयोग परिणाम एवं व्यापारिक लाभ",
    results_sub: "14-दिवसीय दोपहर पायलट के सांख्यिकीय परिणाम",
    result_txns: "लेन-देन में वृद्धि",
    result_revenue: "अतिरिक्त सकल आय",
    result_profit: "शुद्ध लाभ में वृद्धि",
    result_stat_sig: "सांख्यिकीय विश्वसनीयता",
    result_dormant_reactivated: "29 पुराने ग्राहक पुनः सक्रिय हुए",
    result_learning_1: "दोपहर 2-5 PM में 15% छूट ने शाम की बिक्री को नुकसान पहुंचाए बिना ₹5,100 की अतिरिक्त बिक्री दी।",
    result_learning_2: "दोपहर के औसत बिल में ₹85 से ₹138 की वृद्धि दर्ज की गई।",
    save_to_memory_btn: "व्यापारिक मेमोरी में सहेजें",

    // Customer Cohorts Page
    customers_title: "ग्राहक समूह एवं अवधारण (RFM Analysis)",
    customers_sub: "गोपनीयता-सुरक्षित एकत्रित ग्राहक डेटा (शून्य PII एक्सपोज़र)",
    dormant_alert_title: "47 नियमित ग्राहक दुकान छोड़ सकते हैं (78% Churn Risk)",
    launch_winback_btn: "₹30 व्हाट्सएप कूपन अभियान शुरू करें",

    // Split View & Feeds
    hourly_activity_title: "प्रति घंटा बिक्री एवं लेन-देन आवागमन",
    hourly_activity_sub: "दोपहर 2 से 5 PM की मंदी और शाम 6 से 9 PM की भारी भीड़ साफ दिखाई देती है",
    lull_alert_box: "दोपहर 2-5 PM की मंदी: केवल ₹1,410 बिक्री (शाम को ₹8,170 होती है)।",
    simulate_fix: "सिमुलेटर में सुधार जांचें",
    live_soundbox_feed: "लाइव साउंडबॉक्स रीयल-टाइम फीड",
    live_soundbox_sub: "तुरंत आवाज में भुगतान पुष्टि व रसीद",
    soundbox_confirmed: "पुष्टि हुई",

    // Navigation Labels
    nav_overview: "डैशबोर्ड",
    nav_copilot: "एआई सलाहकार",
    nav_opportunities: "अवसर (₹7,400)",
    nav_growth_plan: "ग्रोथ प्लान (₹5,000)",
    nav_simulator: "ग्रोथ सिमुलेटर",
    nav_experiments: "प्रयोग ट्रैकर",
    nav_results: "परिणाम व लाभ",
    nav_customers: "ग्राहक वर्ग",
    nav_insights: "स्टोर इनसाइट्स",
    nav_memory: "व्यापारिक मेमोरी",
    nav_actions: "अनुमोदन व कार्य",
    nav_integration: "पेटीएम कनेक्टर्स",
    nav_architecture: "सिस्टम आर्किटेक्चर",
    nav_observability: "ऑडिट लॉग्स",
    nav_demo: "10-स्टेप डेमो",

    nav_consent: "डेटा गोपनीयता एवं सहमति",
    nav_growth_home: "मर्चेंट ग्रोथ होम",
    next_best_action_title: "अगली सर्वश्रेष्ठ कार्यवाही (Next Best Action)",
    next_best_action_sub: "12 हफ्तों के पेमेंट डेटा व मार्जिन विश्लेषण से अनुशंसित प्राथमिकता कार्य",
    what_happened_label: "क्या हुआ? (Observation)",
    why_matters_label: "यह क्यों महत्वपूर्ण है? (Commercial Impact)",
    what_to_do_label: "व्यापारी को क्या करना चाहिए? (Action)",
    why_this_label: "यही कार्य क्यों? (Why This?)",
    why_not_discount_label: "सीधी छूट क्यों नहीं? (Margin Protection)",
    btn_approve: "स्वीकृत करें एवं शुरू करें",
    btn_modify: "बदलाव करें (Modify)",
    btn_reject: "अस्वीकार करें (Reject)",
    btn_schedule: "समय निर्धारित करें (Schedule)",
    addressable_headroom_label: "पत्ता करने योग्य अतिरिक्त आय (Addressable)",
    gross_headroom_label: "सकल संभावना (Gross)",
    overlap_dedup_badge: "सांख्यिकीय ओवरलैप समायोजित",
    growth_memory_title: "ग्रोथ मेमोरी (Growth Memory)",
    growth_memory_sub: "स्टोर की प्राथमिकताएं, मौसमी रुझान और सिद्ध रणनीतियां",


    // Action Center
    actions_badge: "मानव अनुमोदन ऑडिट ट्रेल",
    actions_title: "कार्यवाही केंद्र एवं मर्चेंट अनुमोदन",
    actions_sub: "व्यापारी निर्णयों, स्वीकृत वर्कफ़्लो और निष्पादन लॉग का स्थायी रिकॉर्ड।",
    status_approved: "स्वीकृत",
    status_scheduled: "निर्धारित",
    status_pending: "अनुमोदन प्रतीक्षारत",
    audit_tamper_proof: "सुरक्षित ऑडिट ट्रेल",
    engine_label: "निष्पादन इंजन",

    // Experiments
    exp_badge: "व्यापारिक प्रयोग रजिस्ट्री",
    exp_title: "सक्रिय ग्रोथ प्रयोग",
    exp_sub: "बंद-लूप परिकल्पना, नियंत्रण बनाम परीक्षण, और मापने योग्य प्रभाव की ट्रैकिंग।",
    exp_running: "सक्रिय",
    exp_completed: "सफलतापूर्वक पूर्ण",
    exp_hypothesis: "परिकल्पना (Hypothesis)",
    exp_baseline: "आधार रेखा",
    exp_target: "लक्ष्य",
    exp_current: "वर्तमान",

    // Memory
    mem_badge: "दीर्घकालिक स्टोर इंटेलिजेंस",
    mem_title: "व्यापारी मेमोरी एवं अनुभव",
    mem_sub: "ग्रोथओएस स्टोर की बारीकियों, मौसमी अनुभवों और मर्चेंट प्राथमिकताओं को संजोता है।",
    mem_confidence: "विश्वसनीयता",
    mem_search_ph: "मेमोरी या अनुभव खोजें...",

    // Insights
    ins_badge: "व्यापारिक रुझान एवं विश्लेषण",
    ins_title: "स्टोर इनसाइट्स एवं बिक्री पैटर्न",
    ins_sub: "घंटेवार लेन-देन आवागमन, बास्केट आत्मीयता और भुगतान माध्यमों का विस्तृत विश्लेषण।",
    ins_hourly_traffic: "घंटेवार बिक्री व आवागमन",
    ins_basket_affinity: "शीर्ष बास्केट कॉम्बो आत्मीयता"
  },

  mr: {
    // Top Bar & App Brand
    app_title: "पेटीएम ग्रोथओएस",
    app_subtitle: "पेटीएम व्यापाऱ्यांसाठी एआय बिझनेस पार्टनर",
    demo_mode: "डेमो मोड",
    demo_disclaimer: "ग्रोथओएस प्रोटोटाइप • पेटीएम मर्चंट परिसंस्थेसाठी डिझाइन केलेले",
    reset_demo: "डेमो रीसेट करा",
    jury_walkthrough: "10-स्टेप ज्युरी डेमो",

    // Store & Header
    store_name: "राजेश जनरल स्टोअर",
    store_location: "कोथरूड, पुणे • किराणा आणि दैनिक वस्तू",
    verified_merchant: "सत्यापित मर्चंट",
    soundbox_online: "पेटीएम साउंडबॉक्स 4.0 ऑनलाइन",
    soundbox_device: "4G VoLTE • डिव्हाइस #SB4-PUN-088",
    auto_settled_banner: "ऑटो-सेटलमेंट: ₹17,840.00 एचडीएफसी बँक खाते •••• 4921 मध्ये सकाळी 06:30 वाजता जमा (UTR: 260906304912)",
    current_batch: "चालू अनसेटल बॅच: ₹580.00",
    next_settlement: "पुढील सेटलमेंट: आज रात्री 11:30 वाजता",

    // Dashboard KPIs
    todays_collections: "आजची एकूण विक्री",
    total_transactions: "एकूण व्यवहार",
    average_ticket: "सरासरी बिल (AOV)",
    repeat_customers: "नियमित ग्राहक (Repeat)",
    payments_count: "पेमेंट्स",
    soundbox_voice_confirmed: "साउंडबॉक्स आवाज पुष्टी",
    peak_hours: "गर्दीची वेळ: 6-9 PM (38/तास)",
    lull_hours: "मंदीची वेळ: 2-5 PM (₹480/तास)",
    first_time_shoppers: "नवीन ग्राहक: 35",
    dormant_alert_pill: "47 नियमित ग्राहक निष्क्रिय ⚠️",

    // Copilot & Command Desk
    copilot_title: "ग्रोथओएस बिझनेस सल्लागार",
    copilot_subtitle: "बोलून किंवा लिहून प्रश्न विचारा (हिंग्लिश / हिंदी / मराठी सपोर्ट)",
    discovered_headroom: "शोधलेली अतिरिक्त उत्पन्न संधी:",
    copilot_placeholder: "व्यवसायाचा कोणताही प्रश्न विचारा (उदा. 'मला या आठवड्यात ₹5,000 जास्त कमवायचे आहेत')...",
    analyze_btn: "विश्लेषण करा",
    listening: "ऐकत आहोत...",
    mic_label: "माइक",
    quick_queries: "जलद प्रश्न:",
    query_5000: "मला या आठवड्यात ₹5,000 जास्त कमवायचे आहेत",
    query_lull: "दुपारी 2 ते 5 PM दरम्यान विक्री का कमी होते?",
    query_dormant: "47 जुन्या नियमित ग्राहकांना परत कसे आणायचे?",

    // Opportunities Page & Dashboard Cards
    opportunities_heading: "व्यवसायातील वाढीच्या संधी (₹7,400 / आठवडा)",
    opportunities_sub: "12 आठवड्यांच्या डेटा विश्लेषणातून 4 ठोस संधी समोर आल्या",
    formulate_plan_btn: "₹5,000 ग्रोथ प्लॅन तयार करा",
    review_action_btn: "कृती तपासा",
    opp_space_identified: "₹7,400 ची वाढीची संधी उपलब्ध",
    opp_space_sub: "स्टोअर डेटाच्या विश्लेषणातून 4 मुख्य संधी मिळाल्या",

    opp_afternoon_title: "दुपारी 2-5 PM चहा-नाश्ता बूस्टर ऑफर",
    opp_afternoon_desc: "दुपारी ग्राहकांची संख्या 68% कमी होते (₹480/तास विरुद्ध ₹2,800 पीक). दुकानाचे भाडे व वीज खर्च चालूच राहतो.",
    opp_afternoon_action: "₹100 वरील बिलावर चहा+समोसा कॉम्बोमध्ये 15% सवलतीचे व्हाउचर द्या",
    opp_afternoon_badge: "दुपारी मंदी निवारण",

    opp_dormant_title: "47 जुन्या नियमित ग्राहकांना पुन्हा सक्रिय करा",
    opp_dormant_desc: "47 नियमित ग्राहक (सरासरी बिल ₹312) मागील 21 दिवसांपासून दुकानात आलेले नाहीत.",
    opp_dormant_action: "पेटीएम व्हॉट्सअॅपवर ₹30 चे वेलकम-बॅक कूपन पाठवा",
    opp_dormant_badge: "ग्राहक टिकवणे",

    opp_basket_title: "चहा + समोसा कॉम्बो क्रॉस-सेल बंडल",
    opp_basket_desc: "डेटा सांगतो की 74% वेळेस चहा घेणारे ग्राहक समोसा देखील सोबत घेतात.",
    opp_basket_action: "बिलिंग काउंटरवर कॉम्बो क्यूआर स्टँडी लावा",
    opp_basket_badge: "बिल वाढ",

    opp_weekend_title: "वीकेंड किराणा बंडल ऑफर",
    opp_weekend_desc: "शनिवार आणि रविवारी सकाळी किराणा सामानाची खरेदी 24% अधिक असते.",
    opp_weekend_action: "₹300 पेक्षा जास्त खरेदीवर ₹20 ची सवलत द्या",
    opp_weekend_badge: "वीकेंड सेल",

    // Growth Plan Page
    growth_plan_title: "साप्ताहिक ग्रोथ प्लॅन (उद्दिष्ट: ₹5,000)",
    growth_plan_sub: "राजेश जी, आपले ₹5,000 चे उद्दिष्ट पूर्ण करण्यासाठी 3 प्राधान्य कृती:",
    progress_label: "उद्दिष्ट पूर्तता प्रगती",
    planned_value: "एकूण नियोजित उत्पन्न: ₹6,200 (उद्दिष्टापेक्षा ₹1,200 जास्त)",
    approve_plan_btn: "ग्रोथ प्लॅन मंजूर करा आणि सुरू करा",
    plan_ready_msg: "3 टप्प्यांचे प्रयोग मर्चंट मंजुरीसाठी तयार आहेत",

    // Simulator Page
    simulator_title: "ग्रोथ सिम्युलेटर मॉडेल (What-If Analysis)",
    simulator_sub: "सवलतीची टक्केवारी आणि वेळ बदलून नफ्याचे अंदाज तपासा",
    param_discount: "प्रचार सवलत टक्केवारी",
    param_hours: "लक्षित वेळ मर्यादा (तास)",
    param_min_cart: "किमान बिलाची रक्कम",
    param_duration: "कालावधी (दिवस)",
    proj_volume: "अपेक्षित अतिरिक्त ग्राहक",
    proj_revenue: "अपेक्षित एकूण विक्री",
    proj_net_profit: "अपेक्षित निव्वळ नफा",
    risk_low: "कमी जोखीम (सुरक्षित मार्जिन)",
    risk_moderate: "मध्यम जोखीम",
    apply_plan_btn: "ग्रोथ प्लॅनमध्ये लागू करा",

    // Results Page
    results_title: "प्रयोगाचे निकाल व नफा मोजमाप",
    results_sub: "14-दिवसांच्या दुपारच्या पायलटचे सत्यापित निकाल",
    result_txns: "व्यवहारांमध्ये वाढ",
    result_revenue: "अतिरिक्त एकूण उत्पन्न",
    result_profit: "निव्वळ नफ्यात वाढ",
    result_stat_sig: "सांख्यिकी विश्वासार्हता",
    result_dormant_reactivated: "29 निष्क्रिय ग्राहक पुन्हा दुकानात आले",
    result_learning_1: "दुपारी 2-5 PM दरम्यान 15% सवलतीने संध्याकाळच्या विक्रीवर परिणाम न करता ₹5,100 अतिरिक्त उत्पन्न मिळवून दिले.",
    result_learning_2: "दुपारच्या सरासरी बिलामध्ये ₹85 वरून ₹138 पर्यंत वाढ झाली.",
    save_to_memory_btn: "व्यापारी मेमरीमध्ये सेव्ह करा",

    // Customer Cohorts Page
    customers_title: "ग्राहक गट व धारणा (RFM Analysis)",
    customers_sub: "गोपनीयता-सुरक्षित एकत्रित ग्राहक डेटा (शून्य वैयक्तिक डेटा लीक)",
    dormant_alert_title: "47 नियमित ग्राहक दुकान सोडू शकतात (78% Churn Risk)",
    launch_winback_btn: "₹30 व्हॉट्सअॅप कूपन मोहीम सुरू करा",

    // Split View & Feeds
    hourly_activity_title: "तासनिहाय विक्री व व्यवहार वर्दळ",
    hourly_activity_sub: "दुपारी 2 ते 5 PM मधील शांतता आणि संध्याकाळी 6 ते 9 PM मधील गर्दी स्पष्ट दिसते",
    lull_alert_box: "दुपारी 2-5 PM मंदी: फक्त ₹1,410 विक्री (संध्याकाळी ₹8,170 होते).",
    simulate_fix: "सिम्युलेटरमध्ये सुधारणा तपासा",
    live_soundbox_feed: "थेट साउंडबॉक्स पेमेंट फीड",
    live_soundbox_sub: "आवाजात त्वरित पुष्टी आणि पावती",
    soundbox_confirmed: "पुष्टी झाली",

    // Navigation Labels
    nav_overview: "डॅशबोर्ड",
    nav_copilot: "एआय सल्लागार",
    nav_opportunities: "संधी (₹7,400)",
    nav_growth_plan: "ग्रोथ प्लॅन (₹5,000)",
    nav_simulator: "ग्रोथ सिम्युलेटर",
    nav_experiments: "प्रयोग ट्रॅकर",
    nav_results: "निकाल व नफा",
    nav_customers: "ग्राहक गट",
    nav_insights: "स्टोअर इनसाइट्स",
    nav_memory: "व्यापारी मेमरी",
    nav_actions: "मंजुरी व कृती",
    nav_integration: "पेटीएम कनेक्टर्स",
    nav_architecture: "सिस्टम आर्किटेक्चर",
    nav_observability: "ऑडिट लॉग्स",
    nav_demo: "10-स्टेप डेमो",
    nav_consent: "डेटा गोपनीयता आणि संमती",
    nav_growth_home: "मर्चंट ग्रोथ होम",
    next_best_action_title: "पुढील सर्वोत्तम कृती (Next Best Action)",
    next_best_action_sub: "12 आठवड्यांच्या पेमेंट डेटा व मार्जिन विश्लेषणावरून शिफारस केलेली कृती",
    what_happened_label: "काय घडले? (Observation)",
    why_matters_label: "हे का महत्त्वाचे आहे? (Commercial Impact)",
    what_to_do_label: "व्यापाऱ्याने काय करावे? (Action)",
    why_this_label: "हीच कृती का? (Why This?)",
    why_not_discount_label: "सपाट सवलत का नाही? (Margin Protection)",
    btn_approve: "मंजूर करा आणि सुरू करा",
    btn_modify: "बदल करा (Modify)",
    btn_reject: "नाकारा (Reject)",
    btn_schedule: "वेळ ठरवा (Schedule)",
    addressable_headroom_label: "अंदाजे प्रत्यक्ष अतिरिक्त उत्पन्न (Addressable)",
    gross_headroom_label: "एकूण संधी (Gross)",
    overlap_dedup_badge: "सांख्यिकीय ओवरलॅप समायोजित",
    growth_memory_title: "ग्रोथ मेमरी (दुकानाचा अनुभव)",
    growth_memory_sub: "दुकानाची वैशिष्ट्ये, यशस्वी पद्धती आणि नफा रक्षण प्राधान्ये",

    // Action Center
    actions_badge: "मानवी मंजुरी ऑडिट ट्रेल",
    actions_title: "कृती केंद्र आणि व्यापारी मंजुरी",
    actions_sub: "व्यापारी निर्णय, मंजूर वर्कफ्लो आणि अंमलबजावणी नोंदींचा कायमस्वरूपी रेकॉर्ड.",
    status_approved: "मंजूर",
    status_scheduled: "नियोजित",
    status_pending: "मंजुरी प्रलंबित",
    audit_tamper_proof: "सुरक्षित ऑडिट ट्रेल",
    engine_label: "अंमलबजावणी इंजिन",

    // Experiments
    exp_badge: "व्यापारी प्रयोग नोंदणी",
    exp_title: "सक्रिय ग्रोथ प्रयोग",
    exp_sub: "हायपोथेसिस, नियंत्रण विरुद्ध चाचणी आणि मोजण्यायोग्य परिणामांचे ट्रॅकिंग.",
    exp_running: "सुरू आहे",
    exp_completed: "यशस्वीरित्या पूर्ण",
    exp_hypothesis: "परिकल्पना (Hypothesis)",
    exp_baseline: "मूळ आधार",
    exp_target: "उद्दिष्ट",
    exp_current: "सध्याचे",

    // Memory
    mem_badge: "दीर्घकालीन स्टोअर बुद्धिमत्ता",
    mem_title: "व्यापारी मेमरी आणि शिकवण",
    mem_sub: "ग्रोथओएस दुकानाची वैशिष्ट्ये, हंगामी अनुभव आणि व्यापारी प्राधान्ये लक्षात ठेवते.",
    mem_confidence: "विश्वासार्हता",
    mem_search_ph: "मेमरी किंवा शिकवण शोधा...",

    // Insights
    ins_badge: "व्यावसायिक ट्रेंड आणि विश्लेषण",
    ins_title: "स्टोअर इनसाइट्स आणि विक्री पॅटर्न",
    ins_sub: "तासनिहाय व्यवहार वर्दळ, बास्केट संबंध आणि पेमेंट पद्धतींचे सखोल विश्लेषण.",
    ins_hourly_traffic: "तासनिहाय विक्री व वर्दळ",
    ins_basket_affinity: "प्रमुख बास्केट कॉम्बो संबंध"
  },

  en: {
    // Top Bar & App Brand
    app_title: "Paytm GrowthOS",
    app_subtitle: "AI Business Partner for Paytm Merchants",
    demo_mode: "DEMO MODE",
    demo_disclaimer: "GrowthOS Prototype • Designed for Paytm Merchant Ecosystem",
    reset_demo: "Reset Demo",
    jury_walkthrough: "10-Step Jury Demo",

    // Store & Header
    store_name: "Rajesh General Store",
    store_location: "Kothrud, Pune • Retail / Grocery",
    verified_merchant: "Verified Merchant",
    soundbox_online: "Paytm Soundbox 4.0 Online",
    soundbox_device: "4G VoLTE • Device #SB4-PUN-088",
    auto_settled_banner: "Auto-Settled: ₹17,840.00 to HDFC Bank A/c •••• 4921 at 06:30 AM (UTR: 260906304912)",
    current_batch: "Current Batch Unsettled: ₹580.00",
    next_settlement: "Next Settlement: Tonight at 11:30 PM",

    // Dashboard KPIs
    todays_collections: "Today's Collections",
    total_transactions: "Total Transactions",
    average_ticket: "Average Ticket (AOV)",
    repeat_customers: "Repeat Customers",
    payments_count: "payments",
    soundbox_voice_confirmed: "Soundbox Voice Confirmed",
    peak_hours: "Peak Hours: 6-9 PM (38/hr)",
    lull_hours: "Lull Hours: 2-5 PM (₹480/hr)",
    first_time_shoppers: "First-time Shoppers: 35",
    dormant_alert_pill: "47 Dormant Regulars at risk ⚠️",

    // Copilot & Command Desk
    copilot_title: "GrowthOS Business Copilot",
    copilot_subtitle: "Voice or text strategic assistant (Hinglish / Hindi / Marathi supported)",
    discovered_headroom: "Discovered Growth Headroom:",
    copilot_placeholder: "Ask anything about your store (e.g. 'I want to earn ₹5,000 extra this week')...",
    analyze_btn: "Analyze Store",
    listening: "Listening...",
    mic_label: "Mic",
    quick_queries: "Quick Queries:",
    query_5000: "I want to earn ₹5,000 extra this week",
    query_lull: "Why are sales dipping between 2 and 5 PM?",
    query_dormant: "How do I bring back 47 dormant regular customers?",

    // Opportunities Page & Dashboard Cards
    opportunities_heading: "Discovered Opportunity Space (₹7,400 / wk)",
    opportunities_sub: "12-week store data telemetry revealed 4 high-probability headroom areas",
    formulate_plan_btn: "Formulate ₹5,000 Growth Plan",
    review_action_btn: "Review Action",
    opp_space_identified: "₹7,400 OPPORTUNITY SPACE IDENTIFIED",
    opp_space_sub: "GrowthOS analyzed 12 weeks of historical store data and detected 4 high-probability commercial opportunity spaces.",

    opp_afternoon_title: "Afternoon 2-5 PM Tea & Snack Booster",
    opp_afternoon_desc: "Afternoon transaction volume plummets 68% (₹480/hr vs ₹2,800 peak). Fixed electricity and rent overhead remain unchanged.",
    opp_afternoon_action: "Launch a 15% discount voucher on tea + snack bundles for orders over ₹100",
    opp_afternoon_badge: "Afternoon Utilization",

    opp_dormant_title: "Win Back 47 Lapsed Regular Customers",
    opp_dormant_desc: "47 loyal regulars (avg ticket ₹312) have not visited in > 21 days.",
    opp_dormant_action: "Dispatch targeted ₹30 welcome-back coupon via Paytm WhatsApp channel",
    opp_dormant_badge: "Customer Retention",

    opp_basket_title: "Tea + Samosa Combo Cross-Sell",
    opp_basket_desc: "Data reveals 74% co-purchase affinity between tea and fresh snacks.",
    opp_basket_action: "Deploy printed counter QR standee promoting the combo deal",
    opp_basket_badge: "Basket Size Expansion",

    opp_weekend_title: "Weekend Grocery Morning Bundle",
    opp_weekend_desc: "Saturday & Sunday morning household grocery shopping spikes by 24%.",
    opp_weekend_action: "Offer flat ₹20 off on basket sizes above ₹300",
    opp_weekend_badge: "Weekend Acceleration",

    // Growth Plan Page
    growth_plan_title: "Weekly Growth Plan (Target: ₹5,000)",
    growth_plan_sub: "Rajesh ji, here is your AI-recommended 3-step action sequence to hit ₹5,000 extra:",
    progress_label: "Target Achievement Progress",
    planned_value: "Total Planned Value: ₹6,200 (₹1,200 headroom buffer)",
    approve_plan_btn: "Approve & Schedule Growth Plan",
    plan_ready_msg: "3 phased experiments staged for merchant sign-off",

    // Simulator Page
    simulator_title: "Growth Scenario Simulator (What-If Analysis)",
    simulator_sub: "Adjust discount depth, active window, and order threshold to stress-test margins",
    param_discount: "Promotion Discount (%)",
    param_hours: "Target Time Window (Hours)",
    param_min_cart: "Minimum Order Threshold",
    param_duration: "Duration (Days)",
    proj_volume: "Projected Extra Customers",
    proj_revenue: "Projected Gross Revenue",
    proj_net_profit: "Projected Net Profit",
    risk_low: "Low Risk (Safe Margins)",
    risk_moderate: "Moderate Risk",
    apply_plan_btn: "Apply to Growth Plan",

    // Results Page
    results_title: "Experiment Outcomes & ROI Verification",
    results_sub: "Empirical telemetry from 14-day afternoon power hours pilot",
    result_txns: "Transaction Volume Lift",
    result_revenue: "Incremental Gross Revenue",
    result_profit: "Incremental Net Profit",
    result_stat_sig: "Statistical Significance",
    result_dormant_reactivated: "29 lapsed regulars reactivated",
    result_learning_1: "15% afternoon combo discount generated ₹5,100 extra revenue with zero cannibalization of evening traffic.",
    result_learning_2: "Average afternoon ticket size rose from ₹85 to ₹138.",
    save_to_memory_btn: "Save to Merchant Memory",

    // Customer Cohorts Page
    customers_title: "Customer Cohorts & Retention (RFM Analysis)",
    customers_sub: "Privacy-preserving aggregate store cohort intelligence (Zero PII leakage)",
    dormant_alert_title: "47 High-Value Regulars at Churn Risk (78% Churn Risk)",
    launch_winback_btn: "Launch ₹30 WhatsApp Campaign",

    // Split View & Feeds
    hourly_activity_title: "Hourly Activity & Transaction Volume Telemetry",
    hourly_activity_sub: "Notice the distinct 2 PM - 5 PM trough contrasted with evening rush",
    lull_alert_box: "2-5 PM Lull Alert: ₹1,410 total sales (Evening rush: ₹8,170).",
    simulate_fix: "Simulate Fix in Sandbox",
    live_soundbox_feed: "Live Paytm Soundbox Feed",
    live_soundbox_sub: "Audio announcement telemetry & instant reconciliation",
    soundbox_confirmed: "Confirmed",

    // Navigation Labels
    nav_overview: "Dashboard",
    nav_copilot: "AI Copilot",
    nav_opportunities: "Opportunities (₹7.4k)",
    nav_growth_plan: "Growth Plan (₹5.0k)",
    nav_simulator: "Growth Simulator",
    nav_experiments: "Experiments",
    nav_results: "Results & ROI",
    nav_customers: "Customer Cohorts",
    nav_insights: "Store Insights",
    nav_memory: "Merchant Memory",
    nav_actions: "Action Center",
    nav_integration: "Paytm Connectors",
    nav_architecture: "System Architecture",
    nav_observability: "Audit Logs",
    nav_demo: "10-Step Demo",
    nav_consent: "Privacy & Consent Center",
    nav_growth_home: "Merchant Growth Home",
    next_best_action_title: "Next Best Action",
    next_best_action_sub: "Single highest-ROI recommended intervention backed by unit margin economics",
    what_happened_label: "What Happened? (Observation)",
    why_matters_label: "Why Does It Matter? (Commercial Impact)",
    what_to_do_label: "What Should You Do? (Prescription)",
    why_this_label: "Why This Action? (Hypothesis)",
    why_not_discount_label: "Why Not A Discount? (Margin Guard)",
    btn_approve: "Approve & Execute",
    btn_modify: "Modify Parameters",
    btn_reject: "Reject Action",
    btn_schedule: "Schedule for Later",
    addressable_headroom_label: "Estimated Addressable Headroom",
    gross_headroom_label: "Gross Opportunity",
    overlap_dedup_badge: "Statistically Deduplicated Overlap",
    growth_memory_title: "Growth Memory",
    growth_memory_sub: "Store quirks, proven strategies, and margin guard preferences",


    // Action Center
    actions_badge: "HUMAN-IN-THE-LOOP AUDIT TRAIL",
    actions_title: "Action Center & Approvals",
    actions_sub: "Immutable record of all merchant decisions, approved workflows, and execution logs.",
    status_approved: "APPROVED",
    status_scheduled: "SCHEDULED",
    status_pending: "PENDING APPROVAL",
    audit_tamper_proof: "Tamper-Proof Audit Trail",
    engine_label: "Execution Engine",

    // Experiments
    exp_badge: "COMMERCIAL EXPERIMENT REGISTRY",
    exp_title: "Live Growth Experiments",
    exp_sub: "Tracking closed-loop hypotheses, control vs treatment, and measurable impact.",
    exp_running: "RUNNING",
    exp_completed: "COMPLETED",
    exp_hypothesis: "Hypothesis",
    exp_baseline: "Baseline",
    exp_target: "Target",
    exp_current: "Current",

    // Memory
    mem_badge: "LONG-TERM STORE INTELLIGENCE",
    mem_title: "Merchant Memory & Learnings",
    mem_sub: "GrowthOS retains store quirks, seasonal learnings, and merchant risk preferences.",
    mem_confidence: "Confidence",
    mem_search_ph: "Search store memories or learnings...",

    // Insights
    ins_badge: "BUSINESS INTELLIGENCE & PATTERNS",
    ins_title: "Store Insights & Patterns",
    ins_sub: "Deep-dive hourly traffic patterns, basket affinities, and payment mode breakdowns.",
    ins_hourly_traffic: "Hourly Sales & Transaction Volume",
    ins_basket_affinity: "Top Basket Item Affinities"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('hi');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('growthos_lang') as Language;
      if (saved && (saved === 'hi' || saved === 'mr' || saved === 'en')) {
        setLanguageState(saved);
      }
    } catch (e) {
      // Ignore SSR / localStorage issues
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('growthos_lang', lang);
    } catch (e) {
      // Ignore
    }
  };

  const t = (key: string, defaultText?: string): string => {
    const langDict = translations[language] || translations.hi;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dict if not found in current language
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return defaultText || key;
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert(text);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (language === 'mr') {
        utterance.lang = 'mr-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS error:", e);
      setIsSpeaking(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, speakText, isSpeaking }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
