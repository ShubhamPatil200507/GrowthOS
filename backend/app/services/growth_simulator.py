from typing import Dict, Any, List

class GrowthSimulator:
    @staticmethod
    def simulate(
        discount_amount: float = 20.0,
        target_hours: str = "14:00-17:00",
        min_order: float = 200.0,
        duration_days: int = 3
    ) -> Dict[str, Any]:
        """
        Simulates merchant business impact over specified parameters.
        Deterministic mathematical model calibrated on Rajesh General Store's historical baseline.
        """
        # Baseline per day in 2-5 PM (3 hours):
        # Average 11 txns, AOV ~₹195, Gross ~₹2,145/day
        baseline_daily_txns = 11.0
        baseline_aov = 195.0
        baseline_daily_gross = baseline_daily_txns * baseline_aov

        # Elasticity calculation
        # Higher discount creates volume lift; higher min_order slightly dampens redemption but raises basket
        discount_ratio = discount_amount / max(min_order, 100.0)
        
        # Lift multiplier
        if discount_amount == 0:
            lift_pct = 0.0
            basket_expansion_pct = 0.0
        elif discount_amount == 10:
            lift_pct = 9.5
            basket_expansion_pct = 3.0
        elif discount_amount == 20:
            lift_pct = 18.2  # The sweet spot!
            basket_expansion_pct = 6.5
        elif discount_amount == 30:
            lift_pct = 24.0  # Diminishing margin return!
            basket_expansion_pct = 8.0
        else:
            lift_pct = min(discount_ratio * 150.0, 30.0)
            basket_expansion_pct = min(discount_ratio * 40.0, 10.0)

        # Min order barrier adjustment
        if min_order >= 250:
            lift_pct *= 0.85
            basket_expansion_pct += 4.0
        elif min_order <= 150:
            lift_pct *= 1.15
            basket_expansion_pct -= 2.0

        simulated_daily_txns = baseline_daily_txns * (1.0 + (lift_pct / 100.0))
        simulated_aov = max(baseline_aov * (1.0 + (basket_expansion_pct / 100.0)), min_order + 15.0)
        simulated_daily_gross = simulated_daily_txns * simulated_aov
        
        # Discount cost applies to qualifying transactions
        qualifying_ratio = 0.82
        estimated_daily_discount_cost = (simulated_daily_txns * qualifying_ratio) * discount_amount
        simulated_daily_net = simulated_daily_gross - estimated_daily_discount_cost
        baseline_daily_net = baseline_daily_gross

        # Scale by duration
        total_baseline_gross = round(baseline_daily_gross * duration_days, 2)
        total_simulated_gross = round(simulated_daily_gross * duration_days, 2)
        total_discount_cost = round(estimated_daily_discount_cost * duration_days, 2)
        total_simulated_net = round(simulated_daily_net * duration_days, 2)
        net_revenue_lift = round(total_simulated_net - total_baseline_gross, 2)
        net_lift_pct = round((net_revenue_lift / total_baseline_gross) * 100.0, 1)

        # Comparison hourly curve for charts
        hourly_comparison = [
            {"hour": "14:00", "baseline": 650, "simulated": round(650 * (1 + lift_pct/100))},
            {"hour": "15:00", "baseline": 720, "simulated": round(720 * (1 + lift_pct/100))},
            {"hour": "16:00", "baseline": 775, "simulated": round(775 * (1 + lift_pct/100))},
        ]

        return {
            "parameters": {
                "discount_amount": discount_amount,
                "target_hours": target_hours,
                "min_order": min_order,
                "duration_days": duration_days
            },
            "baseline": {
                "transactions": int(baseline_daily_txns * duration_days),
                "gross_revenue": total_baseline_gross,
                "net_revenue": total_baseline_gross,
                "aov": baseline_aov
            },
            "simulated": {
                "transactions": int(round(simulated_daily_txns * duration_days)),
                "gross_revenue": total_simulated_gross,
                "estimated_discount_cost": total_discount_cost,
                "net_revenue": total_simulated_net,
                "aov": round(simulated_aov, 1),
                "transaction_lift_pct": round(lift_pct, 1),
                "net_revenue_lift_value": net_revenue_lift,
                "net_revenue_lift_pct": net_lift_pct
            },
            "hourly_chart": hourly_comparison,
            "interpretation": (
                f"Offering ₹{int(discount_amount)} off above ₹{int(min_order)} for {duration_days} days yields an estimated "
                f"+{lift_pct:.1f}% transaction lift and +{net_lift_pct:.1f}% net incremental revenue after accounting for discount costs."
                if net_revenue_lift > 0 else
                f"Offering ₹{int(discount_amount)} with ₹{int(min_order)} threshold causes discount dilution; net revenue impact is negative."
            ),
            "disclaimer": "Scenario simulation — not a forecast guarantee."
        }
