-- Migration to revert back to snake_case naming convention
-- This undoes the camelCase changes to match PostgreSQL conventions

-- Revert brandId back to brand_id
ALTER TABLE leads RENAME COLUMN "brandId" TO brand_id;

-- Revert timestamp columns back to snake_case
ALTER TABLE leads RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE leads RENAME COLUMN "updatedAt" TO updated_at;

-- Revert timestamp columns in lead_activities table
ALTER TABLE lead_activities RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE lead_activities RENAME COLUMN "updatedAt" TO updated_at;

-- Update the trigger function to use snake_case column names
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Update the triggers to use snake_case column names
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lead_activities_updated_at ON lead_activities;
CREATE TRIGGER update_lead_activities_updated_at 
  BEFORE UPDATE ON lead_activities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update indexes to use snake_case column names
DROP INDEX IF EXISTS idx_leads_brandId;
CREATE INDEX idx_leads_brand_id ON leads(brand_id);

DROP INDEX IF EXISTS idx_leads_createdAt;
CREATE INDEX idx_leads_created_at ON leads(created_at);

DROP INDEX IF EXISTS idx_lead_activities_createdAt;
CREATE INDEX idx_lead_activities_created_at ON lead_activities(created_at);

-- Remove the camelCase check constraint and add snake_case version
ALTER TABLE leads DROP CONSTRAINT IF EXISTS check_valid_brand_id;
ALTER TABLE leads ADD CONSTRAINT check_valid_brand_id 
  CHECK (brand_id IN ('percytech', 'gnymble', 'percymd', 'percytext'));

-- Update the comment to reflect snake_case
COMMENT ON COLUMN leads.brand_id IS 'Which PercyTech brand they are interested in (percytech, gnymble, percymd, percytext)';

-- Update the full-text search index to use snake_case
DROP INDEX IF EXISTS idx_leads_search;
CREATE INDEX idx_leads_search ON leads USING GIN (
  to_tsvector('english', 
    COALESCE(first_name, '') || ' ' || 
    COALESCE(last_name, '') || ' ' || 
    COALESCE(email, '') || ' ' || 
    COALESCE(company, '') || ' ' || 
    COALESCE(message, '') || ' ' ||
    COALESCE(brand_id, '')
  )
);

-- Update the helper functions to use snake_case
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

-- Update the lead with activities function to use snake_case
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
