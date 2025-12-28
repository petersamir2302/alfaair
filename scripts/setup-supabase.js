const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://vegnmkhjmuxinqgeaqkk.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL(sql) {
  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 Executing ${statements.length} SQL statements...\n`);

  for (const statement of statements) {
    if (statement.trim()) {
      try {
        // Use REST API to execute SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`
          },
          body: JSON.stringify({ query: statement })
        });

        if (!response.ok) {
          // Try alternative: direct query execution
          console.log(`⚠️  Statement failed, trying alternative method...`);
          console.log(`   SQL: ${statement.substring(0, 100)}...`);
        }
      } catch (error) {
        console.log(`⚠️  Error executing statement: ${error.message}`);
      }
    }
  }
}

async function createStorageBucket() {
  console.log('\n📦 Creating storage bucket...');
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.log('⚠️  Error listing buckets:', listError.message);
    return;
  }

  const bucketExists = buckets?.some(b => b.name === 'product-images');
  
  if (bucketExists) {
    console.log('✅ Storage bucket "product-images" already exists!');
    return;
  }

  const { data, error } = await supabase.storage.createBucket('product-images', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  });

  if (error) {
    console.log('⚠️  Error creating bucket:', error.message);
    console.log('📋 Please create "product-images" bucket manually in Supabase Dashboard → Storage');
  } else {
    console.log('✅ Storage bucket "product-images" created successfully!');
  }
}

async function createAdminUser(email, password) {
  console.log(`\n👤 Creating admin user: ${email}...`);
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      role: 'admin'
    }
  });

  if (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.message.includes('already registered')) {
      console.log('ℹ️  User already exists. You can reset the password in Supabase Dashboard.');
    }
    return null;
  }

  console.log('✅ Admin user created successfully!');
  console.log(`   User ID: ${data.user?.id}`);
  console.log(`   Email: ${data.user?.email}`);
  return data.user;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args[0] === 'create-user') {
    if (!args[1] || !args[2]) {
      console.log('Usage: node scripts/setup-supabase.js create-user <email> <password>');
      process.exit(1);
    }
    await createAdminUser(args[1], args[2]);
    return;
  }

  console.log('🚀 Setting up Supabase for AlfaAir...\n');

  // Read and execute SQL schema
  const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Schema file not found:', schemaPath);
    process.exit(1);
  }

  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  console.log('📋 Note: SQL execution via API is limited.');
  console.log('📋 Please run the SQL from supabase/schema.sql in Supabase Dashboard → SQL Editor\n');
  console.log('📋 The SQL includes:');
  console.log('   - Products table creation');
  console.log('   - Row Level Security policies');
  console.log('   - Timestamp trigger function\n');

  // Create storage bucket
  await createStorageBucket();

  console.log('\n✨ Setup instructions:');
  console.log('1. Go to Supabase Dashboard → SQL Editor');
  console.log('2. Copy and paste the contents of supabase/schema.sql');
  console.log('3. Click "Run" to execute');
  console.log('4. To create an admin user, run:');
  console.log('   node scripts/setup-supabase.js create-user <email> <password>');
}

main().catch(console.error);


