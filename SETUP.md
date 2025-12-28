# Setup Guide

## Quick Start

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vegnmkhjmuxinqgeaqkk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_BcevuDWuCL2t_DL2cNmmmg_PuCNqkQx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44
```

### 2. Supabase Database Setup

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute the SQL script

This will create:
- The `products` table with all required fields
- Row Level Security (RLS) policies
- Automatic timestamp triggers

### 3. Supabase Storage Setup

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Name it: `product-images`
4. Set it to **Public** (toggle "Public bucket")
5. Click **Create bucket**

### 4. Create Admin User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - **Email**: Your admin email (e.g., admin@alfaair.com)
   - **Password**: A strong password
   - **Auto Confirm User**: Enable this checkbox
4. Click **Create user**
5. **Save these credentials** - you'll need them to log in at `/admin/login`

### 5. Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000 to see your website!

## Admin Access

- **Admin Login**: http://localhost:3000/admin/login
- Use the email and password you created in step 4

## Troubleshooting

### Images not uploading?
- Make sure the `product-images` bucket exists and is set to **Public**
- Check that RLS policies allow authenticated users to upload

### Can't log in to admin?
- Verify the admin user was created in Supabase Auth
- Check that "Auto Confirm User" was enabled
- Try resetting the password in Supabase Dashboard

### Database errors?
- Ensure you ran the SQL schema script completely
- Check that RLS is enabled on the products table
- Verify your environment variables are correct


