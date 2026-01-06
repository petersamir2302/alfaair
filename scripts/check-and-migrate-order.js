const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get credentials from environment or use defaults
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vegnmkhjmuxinqgeaqkk.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkTables() {
  console.log('🔍 Checking database tables to verify project...\n');
  console.log(`📡 Connecting to: ${supabaseUrl}\n`);

  try {
    // Check for products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name_ar, name_en, created_at')
      .limit(3);

    if (productsError) {
      console.log('❌ Error accessing products table:', productsError.message);
      return false;
    }

    console.log('✅ Products table found!');
    if (products && products.length > 0) {
      console.log(`   Found ${products.length} sample product(s):`);
      products.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name_ar || p.name_en || 'Unnamed'} (ID: ${p.id.substring(0, 8)}...)`);
      });
    } else {
      console.log('   (Table is empty)');
    }

    // Check for brands table
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('id, name_ar, name_en')
      .limit(1);

    if (!brandsError && brands) {
      console.log('✅ Brands table found!');
    }

    // Check for categories table
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name_ar, name_en')
      .limit(1);

    if (!categoriesError && categories) {
      console.log('✅ Categories table found!');
    }

    // Check if order column already exists
    const { data: orderCheck, error: orderError } = await supabase
      .from('products')
      .select('order')
      .limit(1);

    if (!orderError && orderCheck !== null) {
      console.log('\n✅ Order column already exists!');
      console.log('   Migration may have already been applied.');
      return true;
    } else {
      console.log('\n📋 Order column does not exist yet.');
      console.log('   Ready to run migration.\n');
      return true;
    }
  } catch (error) {
    console.log('❌ Error checking tables:', error.message);
    return false;
  }
}

async function runMigration() {
  console.log('🚀 Running migration: add_order_to_products\n');

  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', 'add_order_to_products.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log('📝 Migration SQL:');
  console.log('─'.repeat(60));
  console.log(sql);
  console.log('─'.repeat(60));
  console.log('');

  // Split SQL into statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📊 Found ${statements.length} SQL statement(s) to execute\n`);

  // Try using Supabase Management API
  const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];
  
  if (!projectRef) {
    console.log('❌ Could not extract project reference from URL');
    return false;
  }

  console.log(`🔗 Using project reference: ${projectRef}\n`);

  try {
    // Use Supabase Management API
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({
        query: sql
      })
    });

    const responseText = await response.text();
    
    if (response.ok) {
      console.log('✅ Migration executed successfully!');
      console.log('📊 Response:', responseText);
      
      // Verify the migration
      console.log('\n🔍 Verifying migration...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('products')
        .select('id, order')
        .limit(5);

      if (!verifyError && verifyData) {
        console.log('✅ Verification successful! Sample products with order:');
        verifyData.forEach((p, i) => {
          console.log(`   ${i + 1}. Order: ${p.order ?? 'NULL'} (ID: ${p.id.substring(0, 8)}...)`);
        });
      }
      
      return true;
    } else {
      console.log('❌ Migration failed!');
      console.log('📊 Response:', responseText);
      return false;
    }
  } catch (error) {
    console.log('❌ Error executing migration:', error.message);
    console.log('\n💡 Alternative: Run the SQL manually in Supabase Dashboard:');
    console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('  Product Order Migration Tool');
  console.log('='.repeat(60));
  console.log('');

  const tablesOk = await checkTables();
  
  if (!tablesOk) {
    console.log('\n❌ Could not verify project. Please check your credentials.');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  const migrationOk = await runMigration();
  
  if (migrationOk) {
    console.log('\n✅ Migration completed successfully!');
  } else {
    console.log('\n⚠️  Migration may need to be run manually.');
    process.exit(1);
  }
}

main().catch(console.error);


