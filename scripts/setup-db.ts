import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vegnmkhjmuxinqgeaqkk.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...\n');

  // Read SQL schema file
  const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // Execute SQL schema
  console.log('📝 Creating products table and policies...');
  const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schema });
  
  if (schemaError) {
    // Try direct SQL execution via REST API
    console.log('⚠️  Direct RPC failed, trying alternative method...');
    // We'll need to use the REST API or SQL editor approach
    console.log('📋 Please run the SQL from supabase/schema.sql in Supabase Dashboard SQL Editor');
  } else {
    console.log('✅ Database schema created successfully!');
  }

  // Create storage bucket
  console.log('\n📦 Creating storage bucket...');
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  
  const bucketExists = buckets?.some(b => b.name === 'product-images');
  
  if (!bucketExists) {
    const { error: createBucketError } = await supabase.storage.createBucket('product-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });

    if (createBucketError) {
      console.log('⚠️  Could not create bucket automatically:', createBucketError.message);
      console.log('📋 Please create "product-images" bucket manually in Supabase Dashboard');
    } else {
      console.log('✅ Storage bucket created successfully!');
    }
  } else {
    console.log('✅ Storage bucket already exists!');
  }

  console.log('\n✨ Database setup complete!');
}

async function createAdminUser(email: string, password: string) {
  console.log(`\n👤 Creating admin user: ${email}...`);
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'admin'
    }
  });

  if (error) {
    console.error('❌ Error creating admin user:', error.message);
    return null;
  }

  console.log('✅ Admin user created successfully!');
  console.log(`   User ID: ${data.user?.id}`);
  return data.user;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args[0] === 'create-user' && args[1] && args[2]) {
    await createAdminUser(args[1], args[2]);
  } else {
    await setupDatabase();
    console.log('\n💡 To create an admin user, run:');
    console.log('   npm run setup:user <email> <password>');
  }
}

main().catch(console.error);


