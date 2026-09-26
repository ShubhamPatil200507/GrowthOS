-- ====================================================================
-- PAYTM GROWTHOS: MULTI-TENANT PRODUCTION POSTGRESQL MIGRATION SCHEMA
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS merchants (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS merchant_consents (
    merchant_id VARCHAR(64) PRIMARY KEY REFERENCES merchants(id) ON DELETE CASCADE,
    business_analytics BOOLEAN DEFAULT TRUE,
    customer_segmentation BOOLEAN DEFAULT TRUE,
    personalized_campaigns BOOLEAN DEFAULT TRUE,
    voice_processing BOOLEAN DEFAULT TRUE,
    external_ai BOOLEAN DEFAULT TRUE,
    data_retention_days INT DEFAULT 90,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS policy_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    risk_tier VARCHAR(32) NOT NULL,
    intent VARCHAR(64) NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    decision VARCHAR(32) NOT NULL,
    reason TEXT NOT NULL,
    input_snippet TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_policy_decisions_merchant ON policy_decisions(merchant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS idempotency_records (
    idempotency_key VARCHAR(128) PRIMARY KEY,
    merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    action_id VARCHAR(64) NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_idempotency_merchant ON idempotency_records(merchant_id);

CREATE TABLE IF NOT EXISTS cannibalization_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    promoted_product VARCHAR(128) NOT NULL,
    companion_bundle VARCHAR(128) NOT NULL,
    risk_level VARCHAR(32) NOT NULL,
    margin_loss_pct NUMERIC(5, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(64) PRIMARY KEY,
    merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    customer_id VARCHAR(64),
    amount NUMERIC(12, 2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    item_count INT DEFAULT 1,
    items_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_txns_merchant_time ON transactions(merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_txns_customer ON transactions(customer_id);

CREATE TABLE IF NOT EXISTS opportunities (
    id VARCHAR(64) PRIMARY KEY,
    merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    opportunity_code VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    estimated_weekly_lift NUMERIC(12, 2) NOT NULL,
    gross_opportunity_value NUMERIC(12, 2) DEFAULT 0.0,
    overlap_factor NUMERIC(5, 2) DEFAULT 0.0,
    addressable_opportunity_value NUMERIC(12, 2) DEFAULT 0.0,
    margin_pct NUMERIC(5, 2) DEFAULT 24.0,
    estimated_discount_cost NUMERIC(12, 2) DEFAULT 0.0,
    estimated_net_contribution NUMERIC(12, 2) DEFAULT 0.0,
    cannibalization_risk VARCHAR(32) DEFAULT 'LOW',
    confidence NUMERIC(5, 2) NOT NULL,
    requires_approval BOOLEAN DEFAULT TRUE,
    payload_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS actions (
    id VARCHAR(64) PRIMARY KEY,
    merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    recommendation_id VARCHAR(64),
    action_type VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    idempotency_key VARCHAR(128),
    policy_status VARCHAR(64) DEFAULT 'APPROVED',
    risk_tier VARCHAR(32) DEFAULT 'LOW',
    rejection_reason TEXT,
    target_segment VARCHAR(128),
    offer_details TEXT,
    execution_engine VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experiments (
    id VARCHAR(64) PRIMARY KEY,
    merchant_id VARCHAR(64) NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    objective TEXT,
    hypothesis TEXT NOT NULL,
    control_spec TEXT,
    treatment_spec TEXT,
    duration_days INT DEFAULT 7,
    target_segment VARCHAR(128),
    primary_metric VARCHAR(128),
    secondary_metrics_json JSONB,
    status VARCHAR(32) DEFAULT 'RUNNING',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
