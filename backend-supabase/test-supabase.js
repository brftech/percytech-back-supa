// Simple Supabase connection test
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  try {
    // Create client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    console.log('✅ Supabase client created');
    console.log('🔗 URL:', process.env.SUPABASE_URL);
    
    // Test basic connection by trying to access a non-existent table
    // This will fail but show us the connection is working
    console.log('📋 Testing connection...');
    const { data, error } = await supabase
      .from('test_connection_table')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('🔍 Error details:', error.message);
      console.log('🔍 Error code:', error.code);
      
      if (error.message.includes('Could not find the table') || error.message.includes('does not exist')) {
        console.log('✅ Successfully connected to Supabase!');
        console.log('📊 Database is accessible (table not found is expected)');
      } else {
        console.log('❌ Unexpected error:', error.message);
        return;
      }
    }
    
    // Now let's check what tables might exist
    console.log('🔍 Checking for existing tables...');
    
    // Try to access some common table names
    const commonTables = ['users', 'profiles', 'brands', 'campaigns'];
    
    for (const tableName of commonTables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);
        
        if (tableError && tableError.message.includes('Could not find the table')) {
          console.log(`   ❌ Table '${tableName}' does not exist`);
        } else if (tableError) {
          console.log(`   ⚠️  Table '${tableName}' has issues: ${tableError.message}`);
        } else {
          console.log(`   ✅ Table '${tableName}' exists and is accessible`);
        }
      } catch (e) {
        console.log(`   ❌ Error checking table '${tableName}': ${e.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testSupabaseConnection();
