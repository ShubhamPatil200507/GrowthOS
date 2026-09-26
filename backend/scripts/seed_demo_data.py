import os
import sys
import random
import json
import hashlib
from datetime import datetime, timedelta

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.database import engine, Base, SessionLocal
from app.db.models import (
    Merchant, MerchantProfile, Customer, Product, Transaction,
    Opportunity, Recommendation, Action, ActionApproval,
    Experiment, ExperimentResult, MerchantMemory, Notification, AuditLog
)

def seed():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing demo data
    print("Clearing old demo data...")
    db.query(AuditLog).delete()
    db.query(Notification).delete()
    db.query(MerchantMemory).delete()
    db.query(ExperimentResult).delete()
    db.query(Experiment).delete()
    db.query(ActionApproval).delete()
    db.query(Action).delete()
    db.query(Recommendation).delete()
    db.query(Opportunity).delete()
    db.query(Transaction).delete()
    db.query(Customer).delete()
    db.query(Product).delete()
    db.query(MerchantProfile).delete()
    db.query(Merchant).delete()
    db.commit()

    print("Seeding Rajesh General Store...")
    merchant_id = "rajesh-general-store-pune-001"
    merchant = Merchant(
        id=merchant_id,
        name="Rajesh Kumar",
        business_name="Rajesh General Store",
        category="Retail / Grocery",
        city="Pune",
        phone="9876543210",
        preferred_language="Hindi",
        created_at=datetime.utcnow() - timedelta(days=90)
    )
    db.add(merchant)

    profile = MerchantProfile(
        merchant_id=merchant_id,
        avg_transaction_value=187.0,
        weekly_revenue=142800.0,
        repeat_customer_rate=0.38,
        peak_hours_start=18,
        peak_hours_end=21,
        weak_hours_start=14,
        weak_hours_end=17,
        settlement_balance=17840.0,
        today_sales=18420.0,
        today_sales_lift_pct=8.4,
        today_transactions=96,
        today_aov=191.0
    )
    db.add(profile)

    # Products
    product_defs = [
        {"name": "Masala Tea (Kadak Chai)", "category": "Beverage", "price": 15.0, "cost": 6.0},
        {"name": "Hot Samosa (2 pcs)", "category": "Snacks", "price": 30.0, "cost": 14.0},
        {"name": "Cold Drink 500ml", "category": "Beverage", "price": 40.0, "cost": 30.0},
        {"name": "Parle-G / Marie Biscuits", "category": "Packaged Food", "price": 20.0, "cost": 15.0},
        {"name": "Whole Wheat Bread 400g", "category": "Bakery", "price": 45.0, "cost": 34.0},
        {"name": "Fresh Cow Milk 1L", "category": "Dairy", "price": 62.0, "cost": 54.0},
        {"name": "Namkeen & Chips Assorted", "category": "Snacks", "price": 35.0, "cost": 25.0},
        {"name": "Plum Cake Slice", "category": "Bakery", "price": 25.0, "cost": 16.0},
        {"name": "Fresh Orange/Mango Juice", "category": "Beverage", "price": 50.0, "cost": 32.0},
        {"name": "Atta / Rice Staple Pack", "category": "Groceries", "price": 320.0, "cost": 270.0}
    ]

    products = []
    for p in product_defs:
        prod = Product(
            merchant_id=merchant_id,
            name=p["name"],
            category=p["category"],
            price=p["price"],
            cost=p["cost"],
            stock_level=random.randint(150, 400)
        )
        db.add(prod)
        products.append(prod)
    db.commit()

    # Seed Customers (1,600 customers to satisfy 1,500+ requirement)
    print("Generating 1,600 synthetic customers...")
    customers = []
    now = datetime.utcnow()
    # 47 dormant customers specifically engineered
    dormant_target = 47
    
    for i in range(1600):
        c_hash = "cust_" + hashlib.sha256(f"rajesh_{i}".encode()).hexdigest()[:12]
        is_dormant = (i < dormant_target)
        
        if is_dormant:
            segment = "Dormant"
            days_ago = random.randint(22, 45)
            first_seen = now - timedelta(days=random.randint(70, 90))
            last_seen = now - timedelta(days=days_ago)
            tx_count = random.randint(3, 8)
            avg_basket = random.uniform(280, 360)
            spent = tx_count * avg_basket
            is_active = False
            days_inactive = days_ago
        elif i < 350:
            segment = "High Value"
            first_seen = now - timedelta(days=random.randint(60, 90))
            last_seen = now - timedelta(days=random.randint(0, 4))
            tx_count = random.randint(12, 28)
            avg_basket = random.uniform(320, 580)
            spent = tx_count * avg_basket
            is_active = True
            days_inactive = random.randint(0, 4)
        elif i < 950:
            segment = "Repeat"
            first_seen = now - timedelta(days=random.randint(40, 85))
            last_seen = now - timedelta(days=random.randint(1, 8))
            tx_count = random.randint(4, 11)
            avg_basket = random.uniform(140, 240)
            spent = tx_count * avg_basket
            is_active = True
            days_inactive = random.randint(1, 8)
        else:
            segment = "New"
            first_seen = now - timedelta(days=random.randint(1, 20))
            last_seen = first_seen
            tx_count = random.randint(1, 2)
            avg_basket = random.uniform(90, 210)
            spent = tx_count * avg_basket
            is_active = True
            days_inactive = (now - last_seen).days

        cust = Customer(
            merchant_id=merchant_id,
            customer_hash=c_hash,
            segment=segment,
            first_seen=first_seen,
            last_seen=last_seen,
            total_spent=round(spent, 2),
            total_transactions=tx_count,
            avg_basket_size=round(avg_basket, 2),
            is_active=is_active,
            days_inactive=days_inactive
        )
        db.add(cust)
        customers.append(cust)

    db.commit()

    # Generate 8,400+ transactions over 12 weeks (84 days)
    print("Generating 8,450 realistic transactions over 12 weeks with injected patterns...")
    transactions = []
    tea_prod = next(p for p in products if "Tea" in p.name)
    samosa_prod = next(p for p in products if "Samosa" in p.name)

    # 84 days (12 weeks)
    for day_offset in range(84, 0, -1):
        day_date = now - timedelta(days=day_offset)
        is_weekend = day_date.weekday() in (4, 5, 6) # Fri, Sat, Sun
        
        # Base daily transaction count: ~90-115 on weekdays, ~110-135 on weekends
        daily_tx_count = random.randint(110, 135) if is_weekend else random.randint(90, 115)

        for _ in range(daily_tx_count):
            # Hour sampling with intentional weak 14-17 (2-5 PM) and peak 18-21 (6-9 PM)
            # Weights per hour (0 to 23):
            # 8-11: morning rush (weight 12)
            # 11-14: lunch hours (weight 9)
            # 14-17: afternoon weak dip (weight 4) -> engineered 32% dip!
            # 17-21: evening prime peak (weight 18)
            # 21-23: late evening (weight 7)
            hour_pool = (
                [8, 9, 10, 11] * 12 +
                [12, 13] * 9 +
                [14, 15, 16] * 4 +  # WEAK LULL
                [17, 18, 19, 20] * 18 + # PRIME PEAK
                [21, 22] * 7
            )
            tx_hour = random.choice(hour_pool)
            tx_minute = random.randint(0, 59)
            tx_second = random.randint(0, 59)
            tx_time = day_date.replace(hour=tx_hour, minute=tx_minute, second=tx_second)

            # Pick a customer
            cust = random.choice(customers)

            # Basket generation with Tea + Samosa affinity
            has_tea_samosa_affinity = random.random() < 0.38
            items = []
            if has_tea_samosa_affinity:
                items.append({"name": tea_prod.name, "qty": random.randint(1, 3), "price": tea_prod.price})
                items.append({"name": samosa_prod.name, "qty": random.randint(1, 2), "price": samosa_prod.price})
                if random.random() < 0.4:
                    extra = random.choice([p for p in products if p.name not in (tea_prod.name, samosa_prod.name)])
                    items.append({"name": extra.name, "qty": 1, "price": extra.price})
            else:
                num_items = random.choices([1, 2, 3, 4], weights=[0.45, 0.35, 0.15, 0.05])[0]
                selected_prods = random.sample(products, num_items)
                for sp in selected_prods:
                    items.append({"name": sp.name, "qty": random.randint(1, 2), "price": sp.price})

            gross = sum(it["qty"] * it["price"] for it in items)
            # Occasional small UPI discount / rounding
            discount = 0.0
            if gross >= 200 and random.random() < 0.1:
                discount = 10.0
            net = max(gross - discount, 10.0)

            tx = Transaction(
                merchant_id=merchant_id,
                customer_id=cust.id,
                timestamp=tx_time,
                total_amount=round(gross, 2),
                discount_amount=round(discount, 2),
                net_amount=round(net, 2),
                payment_method=random.choice(["UPI_PAYTM", "UPI_PAYTM", "UPI_PAYTM", "PAYTM_WALLET", "CARD"]),
                status="SUCCESS",
                items_json=json.dumps(items)
            )
            transactions.append(tx)

    print(f"Adding {len(transactions)} transactions in batch...")
    db.bulk_save_objects(transactions)
    db.commit()

    # Pre-seed Opportunities (Total Opportunity Space: ₹7,400)
    print("Seeding Opportunities...")
    opp1 = Opportunity(
        merchant_id=merchant_id,
        opportunity_code="AFTERNOON_DEMAND",
        title="Afternoon Demand Gap",
        category="Operational / Traffic",
        description="2 PM–5 PM revenue is 32% below baseline. Strong evening traffic exists, but afternoon store utilization remains under-indexed.",
        evidence_json=json.dumps([
            "12-week analysis shows consistent 32% transaction drop between 14:00 and 17:00",
            "Average transaction volume in peak (6-9 PM) is 38 txns/hr vs 8 txns/hr in afternoon",
            "Fixed merchant operational overhead is unchanged during afternoon hours"
        ]),
        baseline_metrics_json=json.dumps({
            "afternoon_sales_avg": 2150.0,
            "afternoon_txns_avg": 11,
            "evening_sales_avg": 7820.0,
            "gap_percentage": 32.0
        }),
        estimated_opportunity_value=2400.0,
        confidence=0.91,
        recommended_action_json=json.dumps({
            "action_type": "OFFER_CREATE",
            "offer_title": "Afternoon Chai & Snacks Power Hours",
            "offer_spec": "₹20 off orders above ₹200",
            "target_hours": "14:00 - 17:00 (2 PM - 5 PM)",
            "duration": "3 days experiment",
            "target_segment": "All walk-in & nearby Paytm app users"
        }),
        experiment_spec_json=json.dumps({
            "hypothesis": "A ₹20 incentive on bills above ₹200 between 2-5 PM will lift afternoon transactions by 15-20% without hurting gross margins.",
            "control": "Standard menu pricing without discount",
            "treatment": "₹20 instant cashback/discount on orders >= ₹200 between 2-5 PM",
            "primary_metric": "Afternoon transaction count",
            "secondary_metrics": ["Gross revenue", "AOV", "Net revenue after discount", "Repeat frequency"]
        }),
        risks_json=json.dumps([
            "Margin dilution if orders naturally above ₹200 claim discount without basket expansion",
            "Cannibalization of evening sales (mitigated by strict 2-5 PM time restriction)"
        ]),
        requires_approval=True,
        status="ACTIVE"
    )

    opp2 = Opportunity(
        merchant_id=merchant_id,
        opportunity_code="DORMANT_WINBACK",
        title="Dormant Customers Re-engagement",
        category="Customer Retention",
        description="47 previously active customers have not transacted in the last 21+ days. Historical average ticket was ₹312.",
        evidence_json=json.dumps([
            "47 identified customers with >= 3 previous visits have gone inactive (> 21 days)",
            "Average past basket size for this dormant group is ₹312 (67% above store average)",
            "Churn risk probability estimated at 78% without intervention"
        ]),
        baseline_metrics_json=json.dumps({
            "dormant_count": 47,
            "avg_past_ticket": 312.0,
            "total_at_risk_monthly_value": 14664.0
        }),
        estimated_opportunity_value=2100.0,
        confidence=0.87,
        recommended_action_json=json.dumps({
            "action_type": "CUSTOMER_WINBACK",
            "offer_title": "Special 'We Miss You' Welcome Back Coupon",
            "offer_spec": "Flat ₹30 off on your next grocery order above ₹250",
            "target_segment": "47 Inactive regulars (> 21 days)",
            "channel": "Paytm App notification & SMS alert"
        }),
        experiment_spec_json=json.dumps({
            "hypothesis": "A personalized ₹30 win-back coupon delivered to customers dormant >21 days will recover at least 15-20% of lapsed regulars.",
            "control": "No winback message",
            "treatment": "Direct Paytm push alert with ₹30 coupon valid for 7 days",
            "primary_metric": "Customer reactivation rate",
            "secondary_metrics": ["30-day retention", "Net recovery revenue"]
        }),
        risks_json=json.dumps([
            "Customer notification fatigue (limited to single high-relevance push notification)",
            "Discount redemption by non-returning customers"
        ]),
        requires_approval=True,
        status="ACTIVE"
    )

    opp3 = Opportunity(
        merchant_id=merchant_id,
        opportunity_code="BASKET_SIZE",
        title="Basket-Size Affinity Bundle",
        category="Average Order Value",
        description="Tea and Hot Samosa frequently co-occur (38% affinity score). Promoting a pre-bundled price point increases transaction value.",
        evidence_json=json.dumps([
            "Cross-purchase affinity shows Tea + Samosa occurs in 38% of snack-hour orders",
            "Solo tea orders average ₹15; bundled snack ticket raises average to ₹65+",
            "High margin profile on freshly prepared tea accommodates bundle value"
        ]),
        baseline_metrics_json=json.dumps({
            "current_aov": 187.0,
            "snack_affinity_rate": 0.38,
            "solo_tea_txns_daily": 28
        }),
        estimated_opportunity_value=1700.0,
        confidence=0.89,
        recommended_action_json=json.dumps({
            "action_type": "OFFER_CREATE",
            "offer_title": "Evening Chai + Samosa Combo",
            "offer_spec": "Chai + 2 Samosas for ₹40 (Save ₹5)",
            "target_segment": "Snack purchasers & Evening footfall",
            "duration": "7 days"
        }),
        experiment_spec_json=json.dumps({
            "hypothesis": "Offering a combo deal on Chai + Samosa will increase average snack basket size and overall evening gross profit.",
            "control": "Individual item pricing (₹15 + ₹30 = ₹45)",
            "treatment": "Combo deal at ₹40 with prominent counter display card",
            "primary_metric": "Basket size & combo unit sales",
            "secondary_metrics": ["Snack revenue lift", "Gross profit contribution"]
        }),
        risks_json=json.dumps([
            "Minor margin shrinkage on customers who would already purchase both items"
        ]),
        requires_approval=True,
        status="ACTIVE"
    )

    opp4 = Opportunity(
        merchant_id=merchant_id,
        opportunity_code="WEEKEND_BOOST",
        title="Weekend Family Grocery Surge",
        category="Traffic & Basket Optimization",
        description="Friday to Sunday transaction volume rises by 24%, driven by staple packaged foods and dairy items.",
        evidence_json=json.dumps([
            "Weekend revenue is 24% higher than Monday-Thursday baseline",
            "Staple grocery items (Atta, Rice, Milk) represent 52% of weekend basket revenue",
            "Higher repeat rate observed during weekend morning slots (9 AM - 12 PM)"
        ]),
        baseline_metrics_json=json.dumps({
            "weekday_avg_revenue": 18200.0,
            "weekend_avg_revenue": 22600.0,
            "staple_mix_pct": 52.0
        }),
        estimated_opportunity_value=1200.0,
        confidence=0.84,
        recommended_action_json=json.dumps({
            "action_type": "CAMPAIGN_CREATE",
            "offer_title": "Weekend Grocery Mega-Saver",
            "offer_spec": "Free 500g Marie Biscuits on grocery purchases above ₹500",
            "target_segment": "Weekend family shoppers",
            "duration": "Weekend (Fri-Sun)"
        }),
        experiment_spec_json=json.dumps({
            "hypothesis": "A high-perceived-value gift with purchase on ₹500+ bills will lift overall weekend AOV from ₹191 to ₹240.",
            "control": "Standard weekend promotions",
            "treatment": "Free biscuit pack with bill >= ₹500",
            "primary_metric": "AOV and ticket distribution above ₹500",
            "secondary_metrics": ["Weekend gross volume", "Margin ROI"]
        }),
        risks_json=json.dumps([
            "Inventory stock-out of gift SKU during peak rush"
        ]),
        requires_approval=True,
        status="ACTIVE"
    )

    db.add_all([opp1, opp2, opp3, opp4])
    db.commit()

    # Pre-seed Recommendations
    print("Seeding Recommendations...")
    rec1 = Recommendation(
        merchant_id=merchant_id,
        opportunity_id=opp1.id,
        title="Run 3-Day Afternoon ₹20 Off Experiment",
        action_type="OFFER_CREATE",
        payload_json=json.dumps({
            "discount_amount": 20,
            "min_order": 200,
            "hours": "14:00-17:00",
            "duration_days": 3
        }),
        status="PENDING"
    )
    rec2 = Recommendation(
        merchant_id=merchant_id,
        opportunity_id=opp2.id,
        title="Trigger Win-Back Alert for 47 Dormant Customers",
        action_type="CUSTOMER_WINBACK",
        payload_json=json.dumps({
            "customer_count": 47,
            "coupon_code": "WELCOME30",
            "channel": "PAYTM_PUSH"
        }),
        status="PENDING"
    )
    rec3 = Recommendation(
        merchant_id=merchant_id,
        opportunity_id=opp3.id,
        title="Deploy Chai + Samosa Combo Promotion",
        action_type="BUNDLE_CREATE",
        payload_json=json.dumps({
            "bundle_price": 40,
            "savings": 5,
            "items": ["Masala Tea", "Hot Samosa"]
        }),
        status="PENDING"
    )
    db.add_all([rec1, rec2, rec3])
    db.commit()

    # Pre-seed Historical Completed Experiment (Afternoon Offer Test) to demonstrate OBSERVE -> ACT -> MEASURE -> LEARN
    print("Seeding Completed Experiment & Results...")
    exp1 = Experiment(
        merchant_id=merchant_id,
        title="Afternoon Power Hours Pilot",
        objective="Lift transaction volume between 2 PM and 5 PM using a ₹20 incentive threshold",
        hypothesis="A ₹20 incentive on bills above ₹200 during 2–5 PM will increase afternoon transaction volume without reducing net revenue.",
        control_spec="No discount (standard pricing)",
        treatment_spec="₹20 off orders above ₹200 between 2-5 PM",
        duration_days=3,
        target_segment="Afternoon Visitors (2-5 PM)",
        primary_metric="Transaction count",
        secondary_metrics_json=json.dumps(["Gross Revenue", "AOV", "Net Revenue", "Repeat Rate"]),
        status="COMPLETED",
        start_date=now - timedelta(days=10),
        end_date=now - timedelta(days=7)
    )
    db.add(exp1)
    db.commit()

    exp_res1 = ExperimentResult(
        experiment_id=exp1.id,
        transaction_lift_pct=17.0,
        aov_lift_pct=4.0,
        revenue_lift_pct=13.0,
        net_revenue_lift_pct=9.0,
        confidence_pct=94.5,
        ai_interpretation="The afternoon experiment increased transaction volume (+17%) while maintaining positive net revenue (+9%) in this synthetic scenario. Customer response was strongest between 3:30 PM and 4:45 PM.",
        next_recommendation="Continue the experiment on Friday and test a combo bundle (Tea + Samosa) instead of a flat discount to expand gross margin.",
        metrics_json=json.dumps({
            "control_transactions": 34,
            "treatment_transactions": 40,
            "control_revenue": 6800.0,
            "treatment_revenue": 7684.0,
            "net_incremental_revenue": 615.0
        })
    )
    db.add(exp_res1)

    # Pre-seed Merchant Memory (Cognee / Local memory simulation)
    print("Seeding Merchant Memory...")
    memories = [
        {"cat": "PREFERENCE", "key": "preferred_language", "val": "Hindi (with conversational Hinglish)", "conf": 0.99},
        {"cat": "BEHAVIOR", "key": "peak_hours", "val": "6:00 PM – 9:00 PM (18:00 - 21:00)", "conf": 0.95},
        {"cat": "BEHAVIOR", "key": "weak_hours", "val": "2:00 PM – 5:00 PM (14:00 - 17:00)", "conf": 0.93},
        {"cat": "BEHAVIOR", "key": "average_basket", "val": "₹187 across all historical transactions", "conf": 0.98},
        {"cat": "STRATEGY", "key": "successful_strategy", "val": "Value bundles (Tea + Snacks) drive higher margin than flat price cuts", "conf": 0.91},
        {"cat": "EXPERIMENT_RESULT", "key": "previous_experiment", "val": "Afternoon 3-day offer yielded +17% txns and +9% net revenue", "conf": 0.94},
        {"cat": "PREFERENCE", "key": "discount_tolerance", "val": "Merchant strongly prefers capping discounts under 10% to protect grocery margins", "conf": 0.92}
    ]
    for m in memories:
        mem = MerchantMemory(
            merchant_id=merchant_id,
            category=m["cat"],
            key=m["key"],
            value=m["val"],
            source="ANALYTICS_LEARNING",
            confidence=m["conf"]
        )
        db.add(mem)

    # Seed Notifications
    print("Seeding Notifications...")
    notifications = [
        {"title": "Afternoon demand gap detected", "msg": "2–5 PM sales are 32% below baseline today. ₹2,400 weekly opportunity available.", "prio": "HIGH", "url": "/opportunities"},
        {"title": "Pilot experiment completed", "msg": "Afternoon Power Hours experiment concluded with +9% net revenue lift.", "prio": "MEDIUM", "url": "/results"},
        {"title": "Dormant customer alert", "msg": "47 regular customers have been inactive for over 21 days.", "prio": "MEDIUM", "url": "/customers"},
        {"title": "Daily settlement processed", "msg": "₹17,840 successfully settled to your linked bank account.", "prio": "LOW", "url": "/dashboard"}
    ]
    for n in notifications:
        notif = Notification(
            merchant_id=merchant_id,
            title=n["title"],
            message=n["msg"],
            priority=n["prio"],
            action_url=n["url"]
        )
        db.add(notif)

    # Audit log
    audit = AuditLog(
        merchant_id=merchant_id,
        event_type="DEMO_DATASET_INITIALIZED",
        actor="System",
        details_json=json.dumps({"transactions_count": len(transactions), "customers_count": len(customers)})
    )
    db.add(audit)

    db.commit()
    db.close()
    print("Seed complete! 8,400+ transactions and all core merchant models successfully generated.")

if __name__ == "__main__":
    seed()
