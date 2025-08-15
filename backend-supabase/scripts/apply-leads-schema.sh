#!/bin/bash

# Script to apply the leads schema to the percytech.dev database
# This creates the leads and lead_activities tables for lead management

set -e

echo "🚀 Applying leads schema to percytech.dev database..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
  echo "❌ Error: Please run this script from the backend directory"
  exit 1
fi

# Check if leads schema file exists
if [ ! -f "database/leads-schema.sql" ]; then
  echo "❌ Error: leads-schema.sql not found in database/ directory"
  exit 1
fi

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
  echo "❌ Error: Supabase CLI not found. Please install it first."
  echo "   Visit: https://supabase.com/docs/guides/cli"
  exit 1
fi

# Check if we're linked to a project
echo "🔗 Checking Supabase project link..."
if ! supabase status &> /dev/null; then
  echo "❌ Error: Not linked to a Supabase project"
  echo "   Please run: supabase link --project-ref YOUR_PROJECT_REF"
  exit 1
fi

# Create a new migration for the leads schema
echo "📝 Creating leads schema migration..."
MIGRATION_NAME="leads_management_schema"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
MIGRATION_FILE="supabase/migrations/${TIMESTAMP}_${MIGRATION_NAME}.sql"

# Copy the leads schema to the migration
cp "database/leads-schema.sql" "$MIGRATION_FILE"

echo "✅ Created migration: $MIGRATION_FILE"

# Apply the migration
echo "🔄 Applying migration to database..."
if supabase db push --linked; then
  echo "✅ Successfully applied leads schema to database!"
  echo ""
  echo "🎯 What was created:"
  echo "   • leads table - for storing marketing leads"
  echo "   • lead_activities table - for tracking lead interactions"
  echo "   • lead_source, lead_status, lead_priority enums"
  echo "   • lead_activity_type, lead_activity_status enums"
  echo "   • Full-text search indexes"
  echo "   • Row Level Security policies"
  echo "   • Helper functions for lead management"
  echo ""
  echo "🔗 The contact forms will now create leads in this database"
  echo "   and sync them to HubSpot automatically!"
else
  echo "❌ Failed to apply migration"
  echo "   Check the error above and try again"
  exit 1
fi
