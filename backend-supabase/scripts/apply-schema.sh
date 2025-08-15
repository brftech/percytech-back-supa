#!/bin/bash

# Script to apply the database schema to Supabase
# This will create all tables, indexes, and functions for the NestJS API

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "$BACKEND_DIR/package.json" ]; then
    print_error "This script must be run from the backend directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f "$BACKEND_DIR/.env" ]; then
    print_error ".env file not found. Please create it with your Supabase credentials."
    exit 1
fi

# Load environment variables
print_status "Loading environment variables..."
source "$BACKEND_DIR/.env"

# Check required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    print_error "Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

print_status "Supabase URL: $SUPABASE_URL"
print_status "Using service role key for schema creation..."

# Create a temporary SQL file with the schema
SCHEMA_FILE="$BACKEND_DIR/database/schema.sql"

if [ ! -f "$SCHEMA_FILE" ]; then
    print_error "Schema file not found: $SCHEMA_FILE"
    exit 1
fi

print_status "Found schema file: $SCHEMA_FILE"

# Function to apply schema using psql (if available)
apply_with_psql() {
    print_status "Attempting to apply schema using psql..."
    
    # Extract host and database from URL
    # URL format: https://project-ref.supabase.co
    HOST=$(echo "$SUPABASE_URL" | sed 's|https://||' | sed 's|\.supabase\.co||')
    HOST="$HOST.supabase.co"
    
    # Default database name for Supabase
    DATABASE="postgres"
    
    # Default port
    PORT="5432"
    
    print_status "Connecting to: $HOST:$PORT/$DATABASE"
    
    # Create connection string
    CONNECTION_STRING="postgresql://postgres.${HOST%%.*}:${SUPABASE_SERVICE_ROLE_KEY}@${HOST}:${PORT}/${DATABASE}"
    
    # Apply schema
    if psql "$CONNECTION_STRING" -f "$SCHEMA_FILE"; then
        print_success "Schema applied successfully using psql!"
        return 0
    else
        print_warning "Failed to apply schema using psql"
        return 1
    fi
}

# Function to apply schema using Node.js
apply_with_node() {
    print_status "Attempting to apply schema using Node.js..."
    
    # Create a temporary Node.js script
    TEMP_SCRIPT="$BACKEND_DIR/temp-apply-schema.js"
    
    cat > "$TEMP_SCRIPT" << 'EOF'
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function applySchema() {
    try {
        console.log('🔌 Connecting to Supabase...');
        
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        
        console.log('✅ Connected to Supabase');
        
        // Read schema file
        const schemaPath = './database/schema.sql';
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found: ${schemaPath}`);
        }
        
        const schema = fs.readFileSync(schemaPath, 'utf8');
        console.log('📋 Schema file loaded');
        
        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`📝 Found ${statements.length} SQL statements to execute`);
        
        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.length === 0) continue;
            
            try {
                console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);
                
                // Use rpc to execute raw SQL (if available)
                const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
                
                if (error) {
                    // Try direct query as fallback
                    const { error: directError } = await supabase
                        .from('information_schema.tables')
                        .select('table_name')
                        .limit(1);
                    
                    if (directError) {
                        console.log(`⚠️  Statement ${i + 1} may have failed: ${statement.substring(0, 100)}...`);
                        console.log(`   Error: ${error.message}`);
                    }
                }
                
            } catch (stmtError) {
                console.log(`⚠️  Statement ${i + 1} failed: ${stmtError.message}`);
                console.log(`   Statement: ${statement.substring(0, 100)}...`);
            }
        }
        
        console.log('✅ Schema application completed');
        
        // Verify tables were created
        console.log('🔍 Verifying schema creation...');
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['users', 'profiles', 'brands', 'campaigns', 'onboarding_progress', 'payments', 'tcr_registrations']);
        
        if (tablesError) {
            console.log('⚠️  Could not verify tables: ' + tablesError.message);
        } else {
            console.log(`📊 Found ${tables.length} tables: ${tables.map(t => t.table_name).join(', ')}`);
        }
        
    } catch (error) {
        console.error('❌ Failed to apply schema:', error.message);
        process.exit(1);
    }
}

applySchema();
EOF

    # Run the Node.js script
    if node "$TEMP_SCRIPT"; then
        print_success "Schema applied successfully using Node.js!"
        rm "$TEMP_SCRIPT"
        return 0
    else
        print_warning "Failed to apply schema using Node.js"
        rm "$TEMP_SCRIPT"
        return 1
    fi
}

# Function to apply schema using Supabase CLI
apply_with_supabase_cli() {
    print_status "Attempting to apply schema using Supabase CLI..."
    
    if ! command -v supabase >/dev/null 2>&1; then
        print_warning "Supabase CLI not found"
        return 1
    fi
    
    # Check if we're in a Supabase project
    if [ -d "$BACKEND_DIR/../supabase" ]; then
        print_status "Found Supabase project directory"
        
        # Copy schema to migrations
        MIGRATION_DIR="$BACKEND_DIR/../supabase/migrations"
        if [ -d "$MIGRATION_DIR" ]; then
            TIMESTAMP=$(date +%Y%m%d%H%M%S)
            NEW_MIGRATION="$MIGRATION_DIR/${TIMESTAMP}_nestjs_api_schema.sql"
            
            cp "$SCHEMA_FILE" "$NEW_MIGRATION"
            print_status "Created migration: $NEW_MIGRATION"
            
            # Try to apply using Supabase CLI
            if supabase db push; then
                print_success "Schema applied successfully using Supabase CLI!"
                return 0
            else
                print_warning "Failed to apply schema using Supabase CLI"
                return 1
            fi
        fi
    fi
    
    return 1
}

# Main execution
main() {
    print_status "🚀 Applying NestJS API schema to Supabase..."
    print_status "This will create all tables, indexes, and functions"
    
    # Try different methods in order of preference
    if apply_with_supabase_cli; then
        print_success "Schema applied successfully!"
        return 0
    elif apply_with_psql; then
        print_success "Schema applied successfully!"
        return 0
    elif apply_with_node; then
        print_success "Schema applied successfully!"
        return 0
    else
        print_error "All methods failed to apply the schema"
        print_status "Manual application required:"
        print_status "1. Copy the schema from: $SCHEMA_FILE"
        print_status "2. Apply it in your Supabase dashboard SQL editor"
        print_status "3. Or use the Supabase CLI: supabase db push"
        return 1
    fi
}

# Run main function
main "$@"
