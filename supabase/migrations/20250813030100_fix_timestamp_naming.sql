-- Migration to fix timestamp field naming conventions
-- Change from snake_case to camelCase to match frontend

-- Rename timestamp columns to camelCase
ALTER TABLE leads RENAME COLUMN created_at TO "createdAt";
ALTER TABLE leads RENAME COLUMN updated_at TO "updatedAt";

-- Rename timestamp columns in lead_activities table
ALTER TABLE lead_activities RENAME COLUMN created_at TO "createdAt";
ALTER TABLE lead_activities RENAME COLUMN updated_at TO "updatedAt";

-- Update the trigger function to use the new column names
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Update the triggers to use the new column names
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lead_activities_updated_at ON lead_activities;
CREATE TRIGGER update_lead_activities_updated_at 
  BEFORE UPDATE ON lead_activities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update indexes to use new column names
DROP INDEX IF EXISTS idx_leads_created_at;
CREATE INDEX idx_leads_createdAt ON leads("createdAt");

DROP INDEX IF EXISTS idx_lead_activities_created_at;
CREATE INDEX idx_lead_activities_createdAt ON lead_activities("createdAt");

-- Update the helper function to use new column names
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

-- Update the lead with activities function
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
      (SELECT json_agg(to_json(la.*) ORDER BY la."createdAt" DESC)
       FROM lead_activities la 
       WHERE la.lead_id = l.id), 
      '[]'::json
    ) as activities
  FROM leads l
  WHERE l.id = lead_uuid;
END;
$$ LANGUAGE plpgsql;
