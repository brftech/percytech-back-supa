-- PercyTech Central Backend Database Schema
-- Built from scratch for NestJS API with TCR integration
-- Ensures all data is properly formatted for API consumption

-- =====================================================================
-- ENUMS
-- =====================================================================

-- User status enum
CREATE TYPE user_status AS ENUM (
    'pending',
    'active', 
    'suspended',
    'completed'
);

-- Brand entity type enum (for TCR)
CREATE TYPE brand_entity_type AS ENUM (
    'PRIVATE_PROFIT',
    'PRIVATE_NONPROFIT',
    'PUBLIC_PROFIT',
    'PUBLIC_NONPROFIT',
    'GOVERNMENT',
    'INDIVIDUAL'
);

-- Brand vertical enum (for TCR)
CREATE TYPE brand_vertical AS ENUM (
    'TECHNOLOGY',
    'HEALTHCARE',
    'FINANCE',
    'EDUCATION',
    'RETAIL',
    'MANUFACTURING',
    'SERVICES',
    'OTHER'
);

-- Brand status enum
CREATE TYPE brand_status AS ENUM (
    'DRAFT',
    'PENDING',
    'APPROVED',
    'REJECTED',
    'ACTIVE',
    'SUSPENDED'
);

-- Campaign status enum
CREATE TYPE campaign_status AS ENUM (
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'ACTIVE',
    'PAUSED',
    'COMPLETED'
);

-- Onboarding step enum
CREATE TYPE onboarding_step AS ENUM (
    'PROFILE_CREATION',
    'EMAIL_VERIFICATION',
    'PHONE_VERIFICATION',
    'COMPANY_INFO',
    'PAYMENT_SETUP',
    'BRAND_CREATION',
    'CAMPAIGN_CREATION',
    'TCR_SUBMISSION',
    'COMPLETED'
);

-- Payment status enum
CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
    'CANCELLED'
);

-- TCR status enum
CREATE TYPE tcr_status AS ENUM (
    'NOT_SUBMITTED',
    'PENDING',
    'APPROVED',
    'REJECTED',
    'UNDER_REVIEW'
);

-- =====================================================================
-- TABLES
-- =====================================================================

-- Users table (core authentication and profile)
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    status user_status DEFAULT 'pending',
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (extended user information)
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    job_title VARCHAR(100),
    avatar_url TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands table (TCR integration)
CREATE TABLE brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    ein VARCHAR(20) UNIQUE,
    entity_type brand_entity_type NOT NULL,
    vertical brand_vertical NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    country VARCHAR(2) NOT NULL,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    status brand_status DEFAULT 'DRAFT',
    tcr_brand_id VARCHAR(100),
    tcr_submission_date TIMESTAMP WITH TIME ZONE,
    tcr_approval_date TIMESTAMP WITH TIME ZONE,
    tcr_rejection_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table (TCR integration)
CREATE TABLE campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    campaign_name VARCHAR(255) NOT NULL,
    description TEXT,
    call_to_action VARCHAR(500),
    sample_message TEXT NOT NULL,
    opt_in_message TEXT NOT NULL,
    opt_out_message TEXT NOT NULL,
    help_message TEXT NOT NULL,
    terms_url VARCHAR(255),
    privacy_url VARCHAR(255),
    daily_message_limit INTEGER DEFAULT 1000,
    messages_sent_today INTEGER DEFAULT 0,
    status campaign_status DEFAULT 'DRAFT',
    tcr_campaign_id VARCHAR(100),
    tcr_submission_date TIMESTAMP WITH TIME ZONE,
    tcr_approval_date TIMESTAMP WITH TIME ZONE,
    tcr_rejection_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Onboarding progress table
CREATE TABLE onboarding_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    current_step onboarding_step DEFAULT 'PROFILE_CREATION',
    profile_creation_completed BOOLEAN DEFAULT false,
    profile_creation_completed_at TIMESTAMP WITH TIME ZONE,
    email_verification_completed BOOLEAN DEFAULT false,
    email_verification_completed_at TIMESTAMP WITH TIME ZONE,
    phone_verification_completed BOOLEAN DEFAULT false,
    phone_verification_completed_at TIMESTAMP WITH TIME ZONE,
    company_info_completed BOOLEAN DEFAULT false,
    company_info_completed_at TIMESTAMP WITH TIME ZONE,
    payment_setup_completed BOOLEAN DEFAULT false,
    payment_setup_completed_at TIMESTAMP WITH TIME ZONE,
    brand_creation_completed BOOLEAN DEFAULT false,
    brand_creation_completed_at TIMESTAMP WITH TIME ZONE,
    campaign_creation_completed BOOLEAN DEFAULT false,
    campaign_creation_completed_at TIMESTAMP WITH TIME ZONE,
    tcr_submission_completed BOOLEAN DEFAULT false,
    tcr_submission_completed_at TIMESTAMP WITH TIME ZONE,
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Amount in cents
    currency VARCHAR(3) DEFAULT 'USD',
    status payment_status DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TCR registrations table (audit trail)
CREATE TABLE tcr_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    registration_type VARCHAR(20) NOT NULL, -- 'BRAND' or 'CAMPAIGN'
    tcr_id VARCHAR(100),
    status tcr_status DEFAULT 'NOT_SUBMITTED',
    submission_date TIMESTAMP WITH TIME ZONE,
    approval_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    tcr_response JSONB,
    retry_count INTEGER DEFAULT 0,
    last_retry_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- INDEXES
-- =====================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Profiles table indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_company_name ON profiles(company_name);

-- Brands table indexes
CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_brands_ein ON brands(ein);
CREATE INDEX idx_brands_status ON brands(status);
CREATE INDEX idx_brands_tcr_brand_id ON brands(tcr_brand_id);
CREATE INDEX idx_brands_entity_type ON brands(entity_type);
CREATE INDEX idx_brands_vertical ON brands(vertical);

-- Campaigns table indexes
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_tcr_campaign_id ON campaigns(tcr_campaign_id);

-- Onboarding table indexes
CREATE INDEX idx_onboarding_user_id ON onboarding_progress(user_id);
CREATE INDEX idx_onboarding_current_step ON onboarding_progress(current_step);
CREATE INDEX idx_onboarding_completed ON onboarding_progress(onboarding_completed);

-- Payments table indexes
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- TCR registrations table indexes
CREATE INDEX idx_tcr_registrations_user_id ON tcr_registrations(user_id);
CREATE INDEX idx_tcr_registrations_brand_id ON tcr_registrations(brand_id);
CREATE INDEX idx_tcr_registrations_campaign_id ON tcr_registrations(campaign_id);
CREATE INDEX idx_tcr_registrations_status ON tcr_registrations(status);
CREATE INDEX idx_tcr_registrations_tcr_id ON tcr_registrations(tcr_id);

-- =====================================================================
-- TRIGGERS
-- =====================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_progress_updated_at BEFORE UPDATE ON onboarding_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tcr_registrations_updated_at BEFORE UPDATE ON tcr_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tcr_registrations ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Users can view own profile details" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile details" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile details" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Brands policies
CREATE POLICY "Users can view own brands" ON brands FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own brands" ON brands FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brands" ON brands FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own brands" ON brands FOR DELETE USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Users can view own campaigns" ON campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own campaigns" ON campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own campaigns" ON campaigns FOR DELETE USING (auth.uid() = user_id);

-- Onboarding policies
CREATE POLICY "Users can view own onboarding progress" ON onboarding_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own onboarding progress" ON onboarding_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own onboarding progress" ON onboarding_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- TCR registrations policies
CREATE POLICY "Users can view own TCR registrations" ON tcr_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own TCR registrations" ON tcr_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own TCR registrations" ON tcr_registrations FOR UPDATE USING (auth.uid() = user_id);

-- Service role can access everything (for API operations)
CREATE POLICY "Service role can manage all users" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage all profiles" ON profiles FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage all brands" ON brands FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage all campaigns" ON campaigns FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage all onboarding" ON onboarding_progress FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage all payments" ON payments FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role can manage all TCR registrations" ON tcr_registrations FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================================
-- HELPER FUNCTIONS
-- =====================================================================

-- Get user's onboarding progress
CREATE OR REPLACE FUNCTION get_user_onboarding_progress(user_uuid UUID)
RETURNS TABLE(
    current_step onboarding_step,
    completed_steps INTEGER,
    total_steps INTEGER,
    progress_percentage INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        op.current_step,
        CASE 
            WHEN op.profile_creation_completed THEN 1 ELSE 0 END +
        CASE 
            WHEN op.email_verification_completed THEN 1 ELSE 0 END +
        CASE 
            WHEN op.phone_verification_completed THEN 1 ELSE 0 END +
        CASE 
            WHEN op.company_info_completed THEN 1 ELSE 0 END +
        CASE 
            WHEN op.payment_setup_completed THEN 1 ELSE 0 END +
        CASE 
            WHEN op.brand_creation_completed THEN 1 ELSE 0 END +
        CASE 
            WHEN op.campaign_creation_completed THEN 1 ELSE 0 END +
        CASE 
            WHEN op.tcr_submission_completed THEN 1 ELSE 0 END AS completed_steps,
        8 AS total_steps,
        ROUND(
            (CASE 
                WHEN op.profile_creation_completed THEN 1 ELSE 0 END +
            CASE 
                WHEN op.email_verification_completed THEN 1 ELSE 0 END +
            CASE 
                WHEN op.phone_verification_completed THEN 1 ELSE 0 END +
            CASE 
                WHEN op.company_info_completed THEN 1 ELSE 0 END +
            CASE 
                WHEN op.payment_setup_completed THEN 1 ELSE 0 END +
            CASE 
                WHEN op.brand_creation_completed THEN 1 ELSE 0 END +
            CASE 
                WHEN op.campaign_creation_completed THEN 1 ELSE 0 END +
            CASE 
                WHEN op.tcr_submission_completed THEN 1 ELSE 0 END) * 100.0 / 8
        ) AS progress_percentage
    FROM onboarding_progress op
    WHERE op.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get TCR submission status summary
CREATE OR REPLACE FUNCTION get_tcr_status_summary(user_uuid UUID)
RETURNS TABLE(
    total_brands INTEGER,
    approved_brands INTEGER,
    pending_brands INTEGER,
    rejected_brands INTEGER,
    total_campaigns INTEGER,
    approved_campaigns INTEGER,
    pending_campaigns INTEGER,
    rejected_campaigns INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT b.id) AS total_brands,
        COUNT(DISTINCT CASE WHEN b.status = 'APPROVED' THEN b.id END) AS approved_brands,
        COUNT(DISTINCT CASE WHEN b.status = 'PENDING' THEN b.id END) AS pending_brands,
        COUNT(DISTINCT CASE WHEN b.status = 'REJECTED' THEN b.id END) AS rejected_brands,
        COUNT(DISTINCT c.id) AS total_campaigns,
        COUNT(DISTINCT CASE WHEN c.status = 'APPROVED' THEN c.id END) AS approved_campaigns,
        COUNT(DISTINCT CASE WHEN c.status = 'PENDING_APPROVAL' THEN c.id END) AS pending_campaigns,
        COUNT(DISTINCT CASE WHEN c.status = 'REJECTED' THEN c.id END) AS rejected_campaigns
    FROM users u
    LEFT JOIN brands b ON u.id = b.user_id
    LEFT JOIN campaigns c ON u.id = c.user_id
    WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- INITIAL DATA
-- =====================================================================

-- Insert default onboarding progress for new users
CREATE OR REPLACE FUNCTION create_default_onboarding_progress()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO onboarding_progress (user_id, current_step)
    VALUES (NEW.id, 'PROFILE_CREATION');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create onboarding progress when user is created
CREATE TRIGGER create_user_onboarding_progress
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_onboarding_progress();

-- =====================================================================
-- FINAL VERIFICATION
-- =====================================================================

DO $$
DECLARE
    table_count INTEGER;
    index_count INTEGER;
    function_count INTEGER;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('users', 'profiles', 'brands', 'campaigns', 'onboarding_progress', 'payments', 'tcr_registrations');
    
    -- Count indexes
    SELECT COUNT(*) INTO index_count 
    FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename IN ('users', 'profiles', 'brands', 'campaigns', 'onboarding_progress', 'payments', 'tcr_registrations');
    
    -- Count functions
    SELECT COUNT(*) INTO function_count 
    FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'public' 
    AND p.proname IN ('get_user_onboarding_progress', 'get_tcr_status_summary', 'create_default_onboarding_progress');
    
    RAISE NOTICE 'Schema creation completed successfully!';
    RAISE NOTICE 'Tables: %, Indexes: %, Functions: %', table_count, index_count, function_count;
    
    IF table_count < 7 THEN
        RAISE WARNING 'Expected 7 tables, but found only %. Please check the schema.', table_count;
    END IF;
END $$;
