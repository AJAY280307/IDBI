-- ==============================================================================
-- FinTwin AI Risk Intelligence Center - PostgreSQL Schema
-- ==============================================================================

-- Enable the pgcrypto extension for UUID generation (if using older Postgres)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =================================================
-- 1. TABLE: users
-- =================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    risk_profile VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 2. TABLE: accounts
-- =================================================
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    current_balance DECIMAL(15,2) DEFAULT 0.00,
    emergency_fund DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 3. TABLE: income_history
-- =================================================
CREATE TABLE income_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    salary DECIMAL(15,2) DEFAULT 0.00,
    bonus DECIMAL(15,2) DEFAULT 0.00,
    other_income DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 4. TABLE: expenses
-- =================================================
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 5. TABLE: investments
-- =================================================
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    investment_type VARCHAR(100) NOT NULL,
    invested_amount DECIMAL(15,2) DEFAULT 0.00,
    current_value DECIMAL(15,2) DEFAULT 0.00,
    returns_percentage DECIMAL(5,2),
    risk_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 6. TABLE: goals
-- =================================================
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) DEFAULT 0.00,
    target_date DATE NOT NULL,
    priority VARCHAR(20),
    status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 7. TABLE: loans
-- =================================================
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    loan_type VARCHAR(100) NOT NULL,
    outstanding_amount DECIMAL(15,2) DEFAULT 0.00,
    emi DECIMAL(15,2) DEFAULT 0.00,
    interest_rate DECIMAL(5,2),
    tenure_months INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 8. TABLE: credit_cards
-- =================================================
CREATE TABLE credit_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    card_name VARCHAR(100) NOT NULL,
    credit_limit DECIMAL(15,2) NOT NULL,
    utilized_amount DECIMAL(15,2) DEFAULT 0.00,
    minimum_due DECIMAL(15,2) DEFAULT 0.00,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 9. TABLE: risk_master
-- =================================================
CREATE TABLE risk_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_name VARCHAR(100) NOT NULL,
    description TEXT,
    severity VARCHAR(20),
    icon VARCHAR(100),
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 10. TABLE: user_risk_analysis
-- =================================================
CREATE TABLE user_risk_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    risk_id UUID REFERENCES risk_master(id) ON DELETE CASCADE,
    risk_score INTEGER NOT NULL,
    risk_level VARCHAR(20),
    estimated_impact DECIMAL(15,2),
    status VARCHAR(20),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 11. TABLE: risk_causes
-- =================================================
CREATE TABLE risk_causes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_risk_id UUID REFERENCES user_risk_analysis(id) ON DELETE CASCADE,
    cause TEXT NOT NULL,
    impact_amount DECIMAL(15,2),
    impact_duration_months INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 12. TABLE: risk_solutions
-- =================================================
CREATE TABLE risk_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_risk_id UUID REFERENCES user_risk_analysis(id) ON DELETE CASCADE,
    solution_title VARCHAR(255) NOT NULL,
    solution_description TEXT,
    estimated_savings DECIMAL(15,2),
    priority VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 13. TABLE: prevention_tips
-- =================================================
CREATE TABLE prevention_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_id UUID REFERENCES risk_master(id) ON DELETE CASCADE,
    tip TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 14. TABLE: action_plans
-- =================================================
CREATE TABLE action_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    risk_id UUID REFERENCES risk_master(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_amount DECIMAL(15,2),
    progress_percentage INTEGER DEFAULT 0,
    deadline DATE,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 15. TABLE: risk_history
-- =================================================
CREATE TABLE risk_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    risk_id UUID REFERENCES risk_master(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    risk_score INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- 16. TABLE: risk_notifications
-- =================================================
CREATE TABLE risk_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    risk_id UUID REFERENCES risk_master(id) ON DELETE CASCADE,
    priority VARCHAR(20),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================
-- DATABASE TRIGGERS FOR UPDATED_AT
-- =================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_risk_analysis_updated_at
BEFORE UPDATE ON user_risk_analysis
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
