import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Merchant(Base):
    __tablename__ = "merchants"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    business_name = Column(String(150), nullable=False)
    category = Column(String(80), nullable=False)
    city = Column(String(80), nullable=False)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    preferred_language = Column(String(30), default="Hindi")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("MerchantProfile", back_populates="merchant", uselist=False, cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="merchant", cascade="all, delete-orphan")
    customers = relationship("Customer", back_populates="merchant", cascade="all, delete-orphan")
    opportunities = relationship("Opportunity", back_populates="merchant", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="merchant", cascade="all, delete-orphan")
    actions = relationship("Action", back_populates="merchant", cascade="all, delete-orphan")
    experiments = relationship("Experiment", back_populates="merchant", cascade="all, delete-orphan")
    memories = relationship("MerchantMemory", back_populates="merchant", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="merchant", cascade="all, delete-orphan")

class MerchantProfile(Base):
    __tablename__ = "merchant_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), unique=True, nullable=False, index=True)
    avg_transaction_value = Column(Float, default=187.0)
    weekly_revenue = Column(Float, default=142800.0)
    repeat_customer_rate = Column(Float, default=0.38)
    peak_hours_start = Column(Integer, default=18)  # 6 PM
    peak_hours_end = Column(Integer, default=21)    # 9 PM
    weak_hours_start = Column(Integer, default=14)  # 2 PM
    weak_hours_end = Column(Integer, default=17)    # 5 PM
    settlement_balance = Column(Float, default=17840.0)
    today_sales = Column(Float, default=18420.0)
    today_sales_lift_pct = Column(Float, default=8.4)
    today_transactions = Column(Integer, default=96)
    today_aov = Column(Float, default=191.0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="profile")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    customer_hash = Column(String(64), nullable=False, index=True)  # Privacy-preserving pseudonymized ID
    segment = Column(String(50), default="Repeat", index=True)  # New, Repeat, High Value, Dormant, At Risk
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow)
    total_spent = Column(Float, default=0.0)
    total_transactions = Column(Integer, default=1)
    avg_basket_size = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    days_inactive = Column(Integer, default=0)

    merchant = relationship("Merchant", back_populates="customers")
    transactions = relationship("Transaction", back_populates="customer")

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    price = Column(Float, nullable=False)
    cost = Column(Float, default=0.0)
    stock_level = Column(Integer, default=100)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("customers.id"), nullable=True, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    total_amount = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    net_amount = Column(Float, nullable=False)
    payment_method = Column(String(30), default="UPI_PAYTM")
    status = Column(String(20), default="SUCCESS")
    items_json = Column(Text, default="[]")  # List of items with product_id, name, qty, price

    merchant = relationship("Merchant", back_populates="transactions")
    customer = relationship("Customer", back_populates="transactions")

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    opportunity_code = Column(String(50), nullable=False, index=True)  # AFTERNOON_DEMAND, DORMANT_WINBACK, BASKET_SIZE, WEEKEND_BOOST
    title = Column(String(150), nullable=False)
    category = Column(String(80), nullable=False)
    description = Column(Text, nullable=False)
    evidence_json = Column(Text, default="[]")
    baseline_metrics_json = Column(Text, default="{}")
    estimated_opportunity_value = Column(Float, nullable=False)
    gross_opportunity_value = Column(Float, default=0.0)
    overlap_factor = Column(Float, default=0.185)
    addressable_opportunity_value = Column(Float, default=0.0)
    margin_pct = Column(Float, default=24.0)
    estimated_discount_cost = Column(Float, default=0.0)
    estimated_net_contribution = Column(Float, default=0.0)
    cannibalization_risk = Column(String(30), default="LOW")
    confidence = Column(Float, default=0.85)
    recommended_action_json = Column(Text, default="{}")
    experiment_spec_json = Column(Text, default="{}")
    risks_json = Column(Text, default="[]")
    requires_approval = Column(Boolean, default=True)
    status = Column(String(30), default="ACTIVE")  # ACTIVE, IN_PLAN, APPROVED, DISMISSED
    created_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="opportunities")
    recommendations = relationship("Recommendation", back_populates="opportunity")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    opportunity_id = Column(String(36), ForeignKey("opportunities.id"), nullable=True)
    title = Column(String(150), nullable=False)
    action_type = Column(String(50), nullable=False)  # OFFER_CREATE, CAMPAIGN_CREATE, BUNDLE_CREATE
    payload_json = Column(Text, default="{}")
    status = Column(String(30), default="PENDING")  # PENDING, APPROVED, REJECTED, EXECUTED
    merchant_feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)

    merchant = relationship("Merchant", back_populates="recommendations")
    opportunity = relationship("Opportunity", back_populates="recommendations")

class Action(Base):
    __tablename__ = "actions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    recommendation_id = Column(String(36), ForeignKey("recommendations.id"), nullable=True)
    action_type = Column(String(50), nullable=False)
    status = Column(String(30), default="PENDING_APPROVAL", index=True)  # PENDING_APPROVAL, APPROVED, EXECUTING, SCHEDULED, COMPLETED, FAILED
    target_segment = Column(String(100), default="All Customers")
    offer_details = Column(String(200), default="")
    execution_engine = Column(String(30), default="DEMO_SIMULATOR")  # DEMO_SIMULATOR, N8N, PAYTM_API
    execution_result_json = Column(Text, default="{}")
    idempotency_key = Column(String(128), nullable=True, index=True)
    policy_status = Column(String(50), default="APPROVED_BY_POLICY")
    risk_tier = Column(String(30), default="MEDIUM")
    rejection_reason = Column(Text, nullable=True)
    executed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="actions")
    approvals = relationship("ActionApproval", back_populates="action")

class ActionApproval(Base):
    __tablename__ = "action_approvals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    action_id = Column(String(36), ForeignKey("actions.id"), nullable=False)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    decision = Column(String(20), nullable=False)  # APPROVED, REJECTED
    decided_by = Column(String(100), default="Merchant (Rajesh Kumar)")
    notes = Column(Text, nullable=True)
    decided_at = Column(DateTime, default=datetime.utcnow)

    action = relationship("Action", back_populates="approvals")

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    objective = Column(String(250), nullable=False)
    hypothesis = Column(Text, nullable=False)
    control_spec = Column(String(200), default="No offer (standard pricing)")
    treatment_spec = Column(String(200), default="₹20 off orders above ₹200")
    duration_days = Column(Integer, default=3)
    target_segment = Column(String(100), default="Afternoon Visitors (2-5 PM)")
    primary_metric = Column(String(80), default="Transaction count")
    secondary_metrics_json = Column(Text, default="[\"Revenue\", \"AOV\", \"Net revenue\", \"Repeat purchase\"]")
    status = Column(String(30), default="RUNNING", index=True)  # SCHEDULED, RUNNING, COMPLETED
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="experiments")
    results = relationship("ExperimentResult", back_populates="experiment", uselist=False)

class ExperimentResult(Base):
    __tablename__ = "experiment_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    experiment_id = Column(String(36), ForeignKey("experiments.id"), unique=True, nullable=False, index=True)
    transaction_lift_pct = Column(Float, default=17.0)
    aov_lift_pct = Column(Float, default=4.0)
    revenue_lift_pct = Column(Float, default=13.0)
    net_revenue_lift_pct = Column(Float, default=9.0)
    confidence_pct = Column(Float, default=94.5)
    ai_interpretation = Column(Text, default="The afternoon experiment increased transaction volume while maintaining positive net revenue in this synthetic scenario.")
    next_recommendation = Column(Text, default="Continue the experiment on Friday and test a bundle instead of a flat discount.")
    metrics_json = Column(Text, default="{}")

    experiment = relationship("Experiment", back_populates="results")

class MerchantMemory(Base):
    __tablename__ = "merchant_memory"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    category = Column(String(50), nullable=False)  # PREFERENCE, BEHAVIOR, STRATEGY, EXPERIMENT_RESULT
    key = Column(String(100), nullable=False)
    value = Column(Text, nullable=False)
    source = Column(String(50), default="ANALYTICS_LEARNING")
    confidence = Column(Float, default=0.9)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="memories")

class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    agent_name = Column(String(80), nullable=False)
    query = Column(Text, nullable=True)
    input_state_json = Column(Text, default="{}")
    output_state_json = Column(Text, default="{}")
    latency_ms = Column(Integer, default=150)
    status = Column(String(20), default="SUCCESS")
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    event_type = Column(String(80), nullable=False)
    actor = Column(String(100), default="Merchant")
    details_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(String(20), default="MEDIUM")  # HIGH, MEDIUM, LOW
    is_read = Column(Boolean, default=False)
    action_url = Column(String(200), default="/dashboard")
    created_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="notifications")


class MerchantConsent(Base):
    __tablename__ = "merchant_consents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), unique=True, nullable=False, index=True)
    business_analytics = Column(Boolean, default=True)
    customer_segmentation = Column(Boolean, default=True)
    personalized_campaigns = Column(Boolean, default=True)
    voice_processing = Column(Boolean, default=True)
    external_ai = Column(Boolean, default=True)
    data_retention_days = Column(Integer, default=90)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    merchant = relationship("Merchant", backref="consent")

class PolicyDecision(Base):
    __tablename__ = "policy_decisions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    risk_tier = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH, BLOCKED
    intent = Column(String(80), nullable=False)
    action_type = Column(String(80), nullable=False)
    decision = Column(String(30), nullable=False)  # ALLOWED, REQUIRES_APPROVAL, BLOCKED
    reason = Column(Text, nullable=False)
    input_snippet = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class IdempotencyRecord(Base):
    __tablename__ = "idempotency_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    idempotency_key = Column(String(128), unique=True, nullable=False, index=True)
    action_id = Column(String(36), nullable=False)
    status = Column(String(30), default="EXECUTED")  # PENDING, EXECUTED, FAILED
    response_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)

class CannibalizationLog(Base):
    __tablename__ = "cannibalization_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    campaign_id = Column(String(50), nullable=False)
    promoted_product = Column(String(100), nullable=False)
    cannibalized_product = Column(String(100), nullable=False)
    estimated_margin_loss = Column(Float, default=0.0)
    recommendation_remedy = Column(String(200), default="Bundle with companion item instead of flat discount")
    detected_at = Column(DateTime, default=datetime.utcnow)
