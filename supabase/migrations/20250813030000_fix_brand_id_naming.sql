-- Migration to fix brand_id naming convention
-- Change from snake_case to camelCase to match frontend

-- Rename the column from brand_id to brandId
ALTER TABLE leads RENAME COLUMN brand_id TO "brandId";

-- Update the index name to match
DROP INDEX IF EXISTS idx_leads_brand_id;
CREATE INDEX idx_leads_brandId ON leads("brandId");

-- Update the comment to reflect the new name
COMMENT ON COLUMN leads."brandId" IS 'Which PercyTech brand they are interested in (percytech, gnymble, percymd, percytext)';

-- Add a check constraint to ensure only valid brand IDs are accepted
ALTER TABLE leads ADD CONSTRAINT check_valid_brand_id 
  CHECK ("brandId" IN ('percytech', 'gnymble', 'percymd', 'percytext'));

-- Update the full-text search index to include the new column name
DROP INDEX IF EXISTS idx_leads_search;
CREATE INDEX idx_leads_search ON leads USING GIN (
  to_tsvector('english', 
    COALESCE(first_name, '') || ' ' || 
    COALESCE(last_name, '') || ' ' || 
    COALESCE(email, '') || ' ' || 
    COALESCE(company, '') || ' ' || 
    COALESCE(message, '') || ' ' ||
    COALESCE("brandId", '')
  )
);
