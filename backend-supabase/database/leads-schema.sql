-- Lead Management Schema for percytech.dev database
-- This schema handles marketing leads separately from authenticated users

-- Lead sources enum
CREATE TYPE lead_source AS ENUM (
  'CONTACT_FORM',
  'DEMO_REQUEST', 
  'WEBSITE_VISIT',
  'REFERRAL',
  'SOCIAL_MEDIA',
  'EMAIL_CAMPAIGN',
  'OTHER'
);

-- Lead status enum
CREATE TYPE lead_status AS ENUM (
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'LOST'
);

-- Lead priority enum
CREATE TYPE lead_priority AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT'
);

-- Lead activities enum
CREATE TYPE lead_activity_type AS ENUM (
  'CONTACT_FORM_SUBMISSION',
  'DEMO_REQUEST',
  'EMAIL_OPEN',
  'EMAIL_CLICK',
  'WEBSITE_VISIT',
  'PHONE_CALL',
  'MEETING_SCHEDULED',
  'MEETING_COMPLETED',
  'PROPOSAL_SENT',
  'PROPOSAL_VIEWED',
  'CONVERSION',
  'OTHER'
);

-- Lead activity status enum
CREATE TYPE lead_activity_status AS ENUM (
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
  'CANCELLED'
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic contact information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  company VARCHAR(200),
  job_title VARCHAR(200),
  website VARCHAR(500),
  industry VARCHAR(100),
  company_size VARCHAR(50),
  
  -- Lead details
  message TEXT,
  how_did_you_hear VARCHAR(200),
  source lead_source NOT NULL DEFAULT 'CONTACT_FORM',
  status lead_status NOT NULL DEFAULT 'NEW',
  priority lead_priority NOT NULL DEFAULT 'MEDIUM',
  
  -- Brand association
  brand_id VARCHAR(50), -- Which PercyTech brand they're interested in
  
  -- HubSpot integration
  hubspot_contact_id VARCHAR(100),
  hubspot_company_id VARCHAR(100),
  
  -- Internal management
  notes TEXT,
  assigned_to UUID, -- User ID of who's handling this lead
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_follow_up_date TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead activities table
CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Activity details
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type lead_activity_type NOT NULL,
  status lead_activity_status NOT NULL DEFAULT 'PENDING',
  title VARCHAR(200) NOT NULL,
  description TEXT,
  notes TEXT,
  
  -- Assignment and scheduling
  assigned_to UUID, -- User ID handling this activity
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  duration VARCHAR(50), -- How long the activity took
  
  -- HubSpot integration
  hubspot_activity_id VARCHAR(100),
  
  -- Additional data
  metadata JSONB, -- Flexible storage for additional data
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_brand_id ON leads(brand_id);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_source ON leads(source);

CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_type ON lead_activities(type);
CREATE INDEX idx_lead_activities_status ON lead_activities(status);
CREATE INDEX idx_lead_activities_assigned_to ON lead_activities(assigned_to);
CREATE INDEX idx_lead_activities_scheduled_date ON lead_activities(scheduled_date);
CREATE INDEX idx_lead_activities_created_at ON lead_activities(created_at);

-- Full-text search indexes
CREATE INDEX idx_leads_search ON leads USING GIN (
  to_tsvector('english', 
    COALESCE(first_name, '') || ' ' || 
    COALESCE(last_name, '') || ' ' || 
    COALESCE(email, '') || ' ' || 
    COALESCE(company, '') || ' ' || 
    COALESCE(message, '')
  )
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_activities_updated_at 
  BEFORE UPDATE ON lead_activities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- Policy for leads: Allow read/write for authenticated users
CREATE POLICY "Users can view and manage leads" ON leads
  FOR ALL USING (auth.role() = 'authenticated');

-- Policy for lead activities: Allow read/write for authenticated users
CREATE POLICY "Users can view and manage lead activities" ON lead_activities
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow service role full access
CREATE POLICY "Service role can manage leads" ON leads
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage lead activities" ON lead_activities
  FOR ALL USING (auth.role() = 'service_role');

-- Helper functions
CREATE OR REPLACE FUNCTION get_lead_stats()
RETURNS TABLE (
  total BIGINT,
  new BIGINT,
  contacted BIGINT,
  qualified BIGINT,
  converted BIGINT,
  lost BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = 'NEW') as new,
    COUNT(*) FILTER (WHERE status = 'CONTACTED') as contacted,
    COUNT(*) FILTER (WHERE status = 'QUALIFIED') as qualified,
    COUNT(*) FILTER (WHERE status = 'CONVERTED') as converted,
    COUNT(*) FILTER (WHERE status = 'LOST') as lost
  FROM leads;
END;
$$ LANGUAGE plpgsql;

-- Function to get lead with recent activities
CREATE OR REPLACE FUNCTION get_lead_with_activities(lead_uuid UUID)
RETURNS TABLE (
  lead_data JSON,
  activities JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_json(l.*) as lead_data,
    COALESCE(
      (SELECT json_agg(to_json(la.*) ORDER BY la.created_at DESC)
       FROM lead_activities la 
       WHERE la.lead_id = l.id), 
      '[]'::json
    ) as activities
  FROM leads l
  WHERE l.id = lead_uuid;
END;
$$ LANGUAGE plpgsql;
