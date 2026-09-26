
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const API_BASE = typeof window !== 'undefined'
  ? '/api'
  : (rawApiUrl.startsWith('http') ? `${rawApiUrl}/api` : (rawApiUrl ? `http://${rawApiUrl}/api` : 'http://127.0.0.1:8000/api'));

export interface DashboardData {
  greeting: string;
  merchant: {
    name: string;
    business_name: string;
    city: string;
    category: string;
  };
  headline_metrics: {
    today_sales: number;
    today_sales_lift_pct: number;
    today_transactions: number;
    today_aov: number;
    repeat_customer_rate_pct: number;
    settlement_balance: number;
  };
  operating_slots: {
    peak_hours: string;
    weak_hours: string;
  };
  suggested_prompts: string[];
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    priority: string;
    is_read: boolean;
    action_url: string;
  }>;
  disclaimer: string;
}

export interface OpportunityItem {
  opportunity_id: string;
  opportunity_code: string;
  title: string;
  category: string;
  evidence: string[];
  baseline_metrics: Record<string, any>;
  estimated_opportunity: {
    currency?: string;
    weekly_value: number;
    label: string;
  };
  confidence: number;
  recommended_action: Record<string, any>;
  experiment: Record<string, any>;
  risks: string[];
  requires_approval: boolean;
  explanation: string;
  disclaimer?: string;
}

export interface OpportunitySpaceData {
  total_opportunity_space: {
    currency: string;
    value: number;
    label: string;
  };
  opportunities_count: number;
  disclaimer: string;
  opportunities: OpportunityItem[];
}

export interface GrowthPlanData {
  goal: {
    target_revenue: number;
    label: string;
    accumulated_opportunity: number;
    current_progress: number;
  };
  recommended_experiments: Array<{
    step_num: string;
    opportunity_id: string;
    recommendation_id: string;
    title: string;
    objective: string;
    target: string;
    duration: string;
    estimated_opportunity: number;
    risk: string;
    expected_measurement: string;
    action_type: string;
    status: string;
  }>;
  disclaimer: string;
  human_in_the_loop_notice: string;
}

export interface ExperimentItem {
  id: string;
  name: string;
  status: string;
  hypothesis: string;
  baseline_metric: number;
  target_metric: number;
  current_metric: number;
  start_date: string;
  end_date: string;
}

export interface ExperimentResultData {
  experiment_id: string;
  name: string;
  status: string;
  period: string;
  baseline_txns: number;
  actual_txns: number;
  txn_lift_pct: number;
  gross_incremental_revenue: number;
  net_profit_lift_pct: number;
  statistical_confidence: number;
  dormant_customers_reactivated: number;
  learnings: string[];
}

export interface MerchantMemoryItem {
  id: string;
  category: string;
  content: string;
  confidence: number;
  created_at: string;
}

export const api = {
  async getDashboard(): Promise<DashboardData> {
    try {
      const res = await fetch(`${API_BASE}/merchant/dashboard`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      return {
        greeting: "Good morning, Rajesh 👋",
        merchant: {
          name: "Rajesh Kumar",
          business_name: "Rajesh General Store",
          city: "Pune",
          category: "Retail / Grocery"
        },
        headline_metrics: {
          today_sales: 18420.0,
          today_sales_lift_pct: 8.4,
          today_transactions: 96,
          today_aov: 191.0,
          repeat_customer_rate_pct: 38.0,
          settlement_balance: 17840.0
        },
        operating_slots: {
          peak_hours: "6:00 PM – 9:00 PM",
          weak_hours: "2:00 PM – 5:00 PM"
        },
        suggested_prompts: [
          "Mujhe iss week ₹5,000 extra kamaana hai",
          "Kal sales kaise badhau?",
          "Meri sales kyu gir rahi hai?",
          "Which customers are at risk?"
        ],
        notifications: [
          {
            id: "n1",
            title: "Afternoon demand gap detected",
            message: "2–5 PM sales are 32% below baseline. ₹2,400 weekly opportunity available.",
            priority: "HIGH",
            is_read: false,
            action_url: "/opportunities"
          }
        ],
        disclaimer: "Prototype • Uses synthetic merchant data"
      };
    }
  },

  async getOpportunities(): Promise<OpportunitySpaceData> {
    try {
      const res = await fetch(`${API_BASE}/opportunities`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      return {
        total_opportunity_space: {
          currency: "INR",
          value: 7400,
          label: "₹7,400 OPPORTUNITY SPACE IDENTIFIED"
        },
        opportunities_count: 4,
        disclaimer: "These are scenario estimates based on synthetic historical data, not guaranteed outcomes.",
        opportunities: [
          {
            opportunity_id: "afternoon-demand",
            opportunity_code: "AFTERNOON_DEMAND",
            title: "Afternoon Demand Gap",
            category: "Operational / Traffic",
            evidence: [
              "12-week analysis shows consistent 32% transaction drop between 14:00 and 17:00",
              "Average transaction volume in peak (6-9 PM) is 38 txns/hr vs 8 txns/hr in afternoon",
              "Fixed store overhead remains unchanged during afternoon hours"
            ],
            baseline_metrics: { afternoon_gap_pct: 32 },
            estimated_opportunity: { weekly_value: 2400, label: "₹2,400/week" },
            confidence: 0.91,
            recommended_action: {
              offer_title: "Afternoon Power Hours",
              offer_spec: "₹20 off orders above ₹200",
              target_hours: "2 PM – 5 PM",
              duration: "3 days experiment"
            },
            experiment: {
              hypothesis: "A ₹20 incentive above ₹200 during 2–5 PM will increase afternoon transaction volume.",
              control: "No offer (standard pricing)",
              treatment: "₹20 off above ₹200",
              primary_metric: "Transaction count"
            },
            risks: ["Margin dilution if threshold isn't respected"],
            requires_approval: true,
            explanation: "2 PM–5 PM revenue is 32% below baseline. Merchant has strong evening demand but weak afternoon utilization."
          },
          {
            opportunity_id: "dormant-customers",
            opportunity_code: "DORMANT_WINBACK",
            title: "Dormant Customers Re-engagement",
            category: "Customer Retention",
            evidence: [
              "47 identified customers with >= 3 previous visits have gone inactive (> 21 days)",
              "Average past basket size for this group is ₹312 (67% above store average)"
            ],
            baseline_metrics: { dormant_count: 47 },
            estimated_opportunity: { weekly_value: 2100, label: "₹2,100/week" },
            confidence: 0.87,
            recommended_action: {
              offer_title: "Targeted Win-back Push",
              offer_spec: "Flat ₹30 off above ₹250",
              target_segment: "47 Inactive regulars (> 21 days)",
              duration: "7 days"
            },
            experiment: {
              hypothesis: "A ₹30 win-back coupon to lapsed regulars will recover 15-20% of dormant customers.",
              control: "No outreach",
              treatment: "Paytm Push Alert with ₹30 coupon",
              primary_metric: "Customer reactivation rate"
            },
            risks: ["Notification fatigue"],
            requires_approval: true,
            explanation: "47 customers have not returned recently. Potential: ₹2,100"
          },
          {
            opportunity_id: "basket-size",
            opportunity_code: "BASKET_SIZE",
            title: "Basket-Size Affinity Bundle",
            category: "Average Order Value",
            evidence: [
              "Tea and Hot Samosa frequently purchased together (38% co-purchase affinity)",
              "Raises average snack ticket from ₹15 to ₹40+"
            ],
            baseline_metrics: { affinity_score: 0.38 },
            estimated_opportunity: { weekly_value: 1700, label: "₹1,700/week" },
            confidence: 0.89,
            recommended_action: {
              offer_title: "Tea + Samosa Combo",
              offer_spec: "Kadak Chai + 2 Samosas for ₹40 (Save ₹5)",
              target_segment: "Snack purchasers",
              duration: "7 days"
            },
            experiment: {
              hypothesis: "A pre-bundled combo deal will expand average evening snack order values.",
              control: "Individual pricing",
              treatment: "Combo at ₹40",
              primary_metric: "Basket size & combo unit volume"
            },
            risks: ["Slight margin sacrifice on natural combo buyers"],
            requires_approval: true,
            explanation: "Tea + Samosa frequently purchased together. Potential: ₹1,700"
          },
          {
            opportunity_id: "weekend-boost",
            opportunity_code: "WEEKEND_BOOST",
            title: "Weekend Grocery Surge",
            category: "Traffic Optimization",
            evidence: [
              "Friday to Sunday revenue is 24% higher than Monday-Thursday baseline",
              "Staple grocery items dominate weekend morning volume"
            ],
            baseline_metrics: { weekend_lift: 24 },
            estimated_opportunity: { weekly_value: 1200, label: "₹1,200/week" },
            confidence: 0.84,
            recommended_action: {
              offer_title: "Weekend Family Mega-Saver",
              offer_spec: "Free Marie Biscuits on grocery orders above ₹500",
              target_segment: "Weekend family shoppers",
              duration: "Weekend"
            },
            experiment: {
              hypothesis: "A gift with purchase on ₹500+ baskets lifts overall weekend AOV.",
              control: "Standard weekend volume",
              treatment: "Free biscuit pack with bill >= ₹500",
              primary_metric: "AOV & volume above ₹500"
            },
            risks: ["SKU stockouts"],
            requires_approval: true,
            explanation: "Friday/Saturday demand is higher. Potential: ₹1,200"
          }
        ]
      };
    }
  },

  async getGrowthPlan(target_revenue: number = 5000): Promise<GrowthPlanData> {
    try {
      const res = await fetch(`${API_BASE}/growth-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_revenue })
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (e) {
      return {
        goal: {
          target_revenue: 5000,
          label: "₹5,000 additional weekly revenue",
          accumulated_opportunity: 6200,
          current_progress: 0
        },
        recommended_experiments: [
          {
            step_num: "01",
            opportunity_id: "afternoon-demand",
            recommendation_id: "rec_1",
            title: "Afternoon Demand Offer",
            objective: "A ₹20 incentive above ₹200 during 2–5 PM will increase afternoon transaction volume.",
            target: "2 PM–5 PM walk-ins & app users",
            duration: "3 days",
            estimated_opportunity: 2400,
            risk: "Low margin risk; capped at orders >= ₹200",
            expected_measurement: "Transaction count & Net revenue",
            action_type: "OFFER_CREATE",
            status: "PENDING"
          },
          {
            step_num: "02",
            opportunity_id: "dormant-customers",
            recommendation_id: "rec_2",
            title: "Dormant Customer Win-Back",
            objective: "Recover at least 15-20% of the 47 lapsed regulars through targeted Paytm push coupon.",
            target: "47 Dormant regulars (> 21 days inactive)",
            duration: "7 days",
            estimated_opportunity: 2100,
            risk: "Discount redemption without repeat; limited to 1 coupon per customer",
            expected_measurement: "Reactivation rate",
            action_type: "CUSTOMER_WINBACK",
            status: "PENDING"
          },
          {
            step_num: "03",
            opportunity_id: "basket-size",
            recommendation_id: "rec_3",
            title: "Tea + Samosa Combo Bundle",
            objective: "Raise evening snack basket size from ₹15 to ₹40+ by pairing high-affinity items.",
            target: "Evening snack transaction volume (5 PM–8 PM)",
            duration: "7 days",
            estimated_opportunity: 1700,
            risk: "Minimal risk; prepared tea yields 60%+ gross margin",
            expected_measurement: "Basket size & combo unit sales",
            action_type: "BUNDLE_CREATE",
            status: "PENDING"
          }
        ],
        disclaimer: "These are scenario estimates based on synthetic historical data, not guaranteed outcomes.",
        human_in_the_loop_notice: "Merchant approval is required before activating any experiment."
      };
    }
  },

  async approveRecommendation(recommendationId: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/recommendations/${recommendationId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: "Approved by Rajesh Kumar via GrowthOS UI" })
      });
      if (!res.ok) throw new Error('Approval error');
      return await res.json();
    } catch (e) {
      return {
        status: "SUCCESS",
        action_id: `act_${recommendationId}`,
        experiment_id: `exp_${recommendationId}`,
        execution_engine: "DEMO_SIMULATOR",
        workflow_steps: [
          { step: 1, title: "Opportunity selected", status: "COMPLETED", detail: "Target: Afternoon Visitors (2-5 PM)" },
          { step: 2, title: "Customer segment prepared", status: "COMPLETED", detail: "Privacy-safe cohort resolved" },
          { step: 3, title: "Campaign payload created", status: "COMPLETED", detail: "Offer: ₹20 off orders above ₹200" },
          { step: 4, title: "Action sent to workflow engine", status: "COMPLETED", detail: "Engine: DEMO_SIMULATOR" },
          { step: 5, title: "Campaign scheduled", status: "COMPLETED", detail: "Duration: 3 days" },
          { step: 6, title: "Experiment activated", status: "COMPLETED", detail: "Tracking ID: EXP_AFT_01" }
        ],
        message: "Action approved and scheduled into active experiment."
      };
    }
  },

  async askAssistant(query: string, language: string = "hi"): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/assistant/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language })
      });
      if (!res.ok) throw new Error('Assistant query error');
      return await res.json();
    } catch (e) {
      return {
        query,
        language,
        explanation: "Maine aapke business ka pichle 12 hafton ka data analyze kiya hai. Dopahar 2 se 5 PM ke beech sales 32% kam rehti hai aur 47 regular grahak dormant hain. Maine ₹7,400 ki scenario opportunity space identify ki hai jisse aapka ₹5,000 extra ka target asani se achieve ho sakta hai.",
        opportunity_space: {
          total_opportunity_space: { value: 7400, label: "₹7,400 OPPORTUNITY SPACE IDENTIFIED" },
          opportunities_count: 4
        },
        growth_plan: await this.getGrowthPlan(5000),
        disclaimer: "These are scenario estimates based on synthetic historical data, not guaranteed outcomes."
      };
    }
  },

  async calculateSimulation(params: {
    discount_amount: number;
    target_hours: string;
    min_order: number;
    duration_days: number;
  }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/simulator/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Simulation error');
      return await res.json();
    } catch (e) {
      const discount = params.discount_amount;
      const lift = discount === 20 ? 18.2 : (discount === 10 ? 9.5 : (discount === 30 ? 24.0 : 0));
      const baseGross = 6435.0;
      const simGross = Math.round(baseGross * (1 + lift / 100));
      const cost = Math.round(discount * 26);
      const simNet = simGross - cost;
      const netLift = simNet - baseGross;
      const netLiftPct = Number(((netLift / baseGross) * 100).toFixed(1));

      return {
        parameters: params,
        baseline: { transactions: 33, gross_revenue: baseGross, net_revenue: baseGross, aov: 195.0 },
        simulated: {
          transactions: Math.round(33 * (1 + lift / 100)),
          gross_revenue: simGross,
          estimated_discount_cost: cost,
          net_revenue: simNet,
          aov: 206.5,
          transaction_lift_pct: lift,
          net_revenue_lift_value: netLift,
          net_revenue_lift_pct: netLiftPct
        },
        hourly_chart: [
          { hour: "14:00", baseline: 650, simulated: Math.round(650 * (1 + lift / 100)) },
          { hour: "15:00", baseline: 720, simulated: Math.round(720 * (1 + lift / 100)) },
          { hour: "16:00", baseline: 775, simulated: Math.round(775 * (1 + lift / 100)) }
        ],
        interpretation: `Offering ₹${discount} off above ₹${params.min_order} for ${params.duration_days} days yields an estimated +${lift}% transaction lift and +${netLiftPct}% net incremental revenue after accounting for discount costs.`,
        disclaimer: "Scenario simulation — not a forecast guarantee."
      };
    }
  },

  async getLatestResults(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/experiments/results/latest`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Results error');
      return await res.json();
    } catch (e) {
      return {
        title: "Afternoon Power Hours Pilot",
        hypothesis: "A ₹20 incentive on bills above ₹200 during 2–5 PM will increase afternoon transaction volume without reducing net revenue.",
        control_spec: "No discount (standard pricing)",
        treatment_spec: "₹20 off orders above ₹200 between 2-5 PM",
        results: {
          transaction_lift_pct: 17.0,
          aov_lift_pct: 4.0,
          revenue_lift_pct: 13.0,
          net_revenue_lift_pct: 9.0,
          confidence_pct: 94.5,
          net_incremental_revenue: 615.0
        },
        ai_interpretation: "The afternoon experiment increased transaction volume (+17%) while maintaining positive net revenue (+9%) in this synthetic scenario.",
        next_recommendation: "Continue the experiment on Friday and test a combo bundle (Tea + Samosa) instead of a flat discount.",
        loop_stage: "LEARN"
      };
    }
  },

  async resetDemo(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/admin/reset-demo`, { method: 'POST' });
      return await res.json();
    } catch (e) {
      return { status: "SUCCESS", message: "Demo data reset" };
    }
  },

  async getExperiments(): Promise<ExperimentItem[]> {
    try {
      const res = await fetch(`${API_BASE}/experiments`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Experiments fetch error');
      return await res.json();
    } catch (e) {
      return [
        {
          id: "exp_afternoon_01",
          name: "Afternoon 2-5 PM Tea & Snack Booster",
          status: "RUNNING",
          hypothesis: "Offering 15% off tea+snack combos between 2-5 PM will convert low-volume hours into ₹2,400 additional weekly volume.",
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
      ];
    }
  },

  async getExperimentResults(): Promise<ExperimentResultData> {
    try {
      const res = await fetch(`${API_BASE}/experiments/results/latest`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Results fetch error');
      return await res.json();
    } catch (e) {
      return {
        experiment_id: "exp_afternoon_01",
        name: "Afternoon 2-5 PM Tea & Snack Booster",
        status: "COMPLETED",
        period: "14-Day Evaluated Cycle",
        baseline_txns: 212,
        actual_txns: 248,
        txn_lift_pct: 17.0,
        gross_incremental_revenue: 5100.0,
        net_profit_lift_pct: 9.2,
        statistical_confidence: 96.0,
        dormant_customers_reactivated: 29,
        learnings: [
          "15% discount on Tea+Snack combos between 2-5 PM converted low-demand hours into high margin add-ons.",
          "Average order value during afternoon hours increased from ₹85 to ₹138.",
          "Zero cannibalization observed on evening peak hours (6-9 PM sales remained flat +1.2%)."
        ]
      };
    }
  },

  async getMemory(): Promise<MerchantMemoryItem[]> {
    try {
      const res = await fetch(`${API_BASE}/memory`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Memory fetch error');
      return await res.json();
    } catch (e) {
      return [
        {
          id: "mem_01",
          category: "CAMPAIGN_LEARNING",
          content: "Afternoon 15% discount on tea+samosa combo lifted 2-5 PM lull by +17% transactions with zero evening cannibalization.",
          confidence: 0.94,
          created_at: "2026-09-24"
        },
        {
          id: "mem_02",
          category: "BASKET_AFFINITY",
          content: "Tea and Samosa have 74% co-purchase affinity during tea-time hours. Always recommend them together.",
          confidence: 0.98,
          created_at: "2026-09-21"
        },
        {
          id: "mem_03",
          category: "MERCHANT_PREFERENCE",
          content: "Rajesh Kumar prefers WhatsApp communications over SMS; maximum acceptable discount threshold is strictly 20%.",
          confidence: 1.0,
          created_at: "2026-09-18"
        },
        {
          id: "mem_04",
          category: "SEASONAL_TREND",
          content: "Weekend morning crowd buys dairy milk and bread together between 7:00 AM - 10:00 AM with 68% frequency.",
          confidence: 0.89,
          created_at: "2026-09-15"
        }
      ];
    }
  },

  async getConsent(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/consent`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Consent fetch error');
      return await res.json();
    } catch (e) {
      return {
        merchant_id: "rajesh-general-store-pune-001",
        business_name: "Rajesh General Store",
        consents: {
          business_analytics: true,
          customer_segmentation: true,
          personalized_campaigns: true,
          voice_processing: true,
          external_ai: true,
          data_retention_days: 90
        },
        transparency: {
          data_controller: "Paytm GrowthOS Demo Merchant Instance",
          pii_sharing: "Zero PII shared with external LLMs (tokenized cohorts only)",
          withdrawal_policy: "Merchants may modify or withdraw consent at any time; changes take effect immediately."
        },
        updated_at: new Date().toISOString()
      };
    }
  },

  async updateConsent(consents: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consents)
      });
      return await res.json();
    } catch (e) {
      return { status: "UPDATED", consents };
    }
  },

  async approveAction(recommendationId: string | number = "rec_01"): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/actions/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendation_id: String(recommendationId),
          action_type: "OFFER_CREATE",
          target_segment: "Afternoon Visitors (2-5 PM)",
          offer_details: "15% off Tea+Samosa combo orders above ₹100",
          duration_days: 7,
          approved: true,
          approved_by: "Rajesh Kumar (Merchant)",
          action_version: 1
        })
      });
      if (!res.ok) throw new Error('Action approval error');
      return await res.json();
    } catch (e) {
      return { status: "APPROVED", message: "Approved successfully" };
    }
  },

  async modifyAction(recommendationId: string | number, notes: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/actions/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendation_id: String(recommendationId),
          modification_notes: typeof notes === 'string' ? notes : JSON.stringify(notes),
          approved: true
        })
      });
      return await res.json();
    } catch (e) {
      return { status: "MODIFIED_SCHEDULED" };
    }
  },

  async rejectAction(recommendationId: string | number, reason: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/actions/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendation_id: String(recommendationId),
          reason: reason
        })
      });
      return await res.json();
    } catch (e) {
      return { status: "REJECTED", reason };
    }
  },

};

