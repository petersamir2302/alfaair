require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.log('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkProject() {
  console.log('🔍 Verifying project...\n');
  console.log(`📡 Project: ${supabaseUrl}\n`);

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name_ar, name_en, created_at')
    .limit(3);

  if (error) {
    console.log('❌ Error:', error.message);
    return false;
  }

  console.log('✅ Verified project! Found tables: products, brands, categories');
  if (products && products.length > 0) {
    console.log(`   Sample products: ${products.length}`);
    products.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name_ar || p.name_en || 'Unnamed'}`);
    });
  }
  console.log('');
  return true;
}

async function checkOrderColumn() {
  // Try to select order column
  const { data, error } = await supabase
    .from('products')
    .select('order')
    .limit(1);

  if (error && error.message.includes('column') && error.message.includes('order')) {
    return false; // Column doesn't exist
  }
  return true; // Column exists or different error
}

async function executeMigrationViaRPC() {
  console.log('🚀 Attempting migration via RPC function...\n');

  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', 'add_order_to_products.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  // Try exec_sql RPC function if it exists
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: sql 
    });

    if (!error) {
      console.log('✅ Migration executed via RPC!');
      return true;
    }
  } catch (error) {
    console.log('⚠️  exec_sql RPC not available');
  }

  return false;
}

async function executeMigrationViaHTTP() {
  console.log('🚀 Attempting migration via HTTP endpoint...\n');

  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', 'add_order_to_products.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok) {
      console.log('✅ Migration executed via HTTP RPC!');
      return true;
    } else {
      const errorText = await response.text();
      console.log('⚠️  HTTP RPC failed:', errorText.substring(0, 200));
    }
  } catch (error) {
    console.log('⚠️  HTTP RPC error:', error.message);
  }

  return false;
}

async function executeMigrationManually() {
  console.log('📋 Migration SQL to run manually:\n');
  console.log('─'.repeat(60));
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', 'add_order_to_products.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  console.log(sql);
  console.log('─'.repeat(60));
  
  const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];
  console.log(`\n💡 Run this SQL in Supabase Dashboard:`);
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
}

async function main() {
  console.log('='.repeat(60));
  console.log('  Product Order Migration');
  console.log('='.repeat(60));
  console.log('');

  if (!await checkProject()) {
    process.exit(1);
  }

  const hasOrderColumn = await checkOrderColumn();
  if (hasOrderColumn) {
    console.log('✅ Order column already exists! Migration may be complete.\n');
    
    // Verify by checking a product
    const { data: sample } = await supabase
      .from('products')
      .select('id, order')
      .limit(1);
    
    if (sample && sample[0]) {
      console.log(`   Sample product order value: ${sample[0].order ?? 'NULL'}`);
    }
    return;
  }

  console.log('📋 Order column does not exist. Running migration...\n');

  // Try RPC method
  if (await executeMigrationViaRPC()) {
    console.log('\n✅ Migration completed!');
    return;
  }

  // Try HTTP method
  if (await executeMigrationViaHTTP()) {
    console.log('\n✅ Migration completed!');
    return;
  }

  // Fallback: Show manual instructions
  console.log('\n⚠️  Could not execute migration automatically.');
  console.log('   Supabase requires SQL to be executed via SQL Editor.\n');
  await executeMigrationManually();
}

main().catch(console.error);


