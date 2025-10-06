#!/usr/bin/env node

/**
 * Setup script for Supabase database integration
 * This will help you set up a database for your SDLC workflow
 */

console.log('🚀 Setting up Supabase database for SDLC Workflow...\n');

console.log('📋 Step-by-step setup:');
console.log('');
console.log('1. 🌐 Go to https://supabase.com');
console.log('2. 📝 Sign up for free account');
console.log('3. 🆕 Create new project');
console.log('4. 📊 Go to SQL Editor and run this SQL:');
console.log('');
console.log('```sql');
console.log('-- Create table for SDLC workflow data');
console.log('CREATE TABLE sdlc_workflow (');
console.log('  id SERIAL PRIMARY KEY,');
console.log('  data JSONB NOT NULL,');
console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
console.log('  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
console.log(');');
console.log('');
console.log('-- Insert initial data');
console.log('INSERT INTO sdlc_workflow (data) VALUES (');
console.log('  \'{"metadata": {"version": "1.0", "totalPhases": 0, "totalCategories": 0, "totalItems": 0}, "phases": {}}\'');
console.log(');');
console.log('');
console.log('-- Create function to update data');
console.log('CREATE OR REPLACE FUNCTION update_sdlc_data(new_data JSONB)');
console.log('RETURNS JSONB AS $$');
console.log('BEGIN');
console.log('  UPDATE sdlc_workflow SET data = new_data, updated_at = NOW() WHERE id = 1;');
console.log('  RETURN (SELECT data FROM sdlc_workflow WHERE id = 1);');
console.log('END;');
console.log('$$ LANGUAGE plpgsql;');
console.log('```');
console.log('');
console.log('5. 🔑 Get your credentials:');
console.log('   - Project URL');
console.log('   - Anon Key (public)');
console.log('   - Service Role Key (secret)');
console.log('');
console.log('6. ⚙️  Add to Netlify Environment Variables:');
console.log('   - SUPABASE_URL = your-project-url');
console.log('   - SUPABASE_ANON_KEY = your-anon-key');
console.log('   - SUPABASE_SERVICE_KEY = your-service-key');
console.log('');
console.log('7. 📦 Install dependencies:');
console.log('   npm install @supabase/supabase-js');
console.log('');
console.log('✅ That\'s it! Your database will be ready.');
console.log('');
console.log('🔗 Supabase Dashboard: https://supabase.com/dashboard');
console.log('📚 Supabase Docs: https://supabase.com/docs');
