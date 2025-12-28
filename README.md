# AlfaAir - AC Trading Company Website

A modern, bilingual (Arabic/English) website for AlfaAir AC trading company built with Next.js and Supabase.

## Features

- 🌐 **Bilingual Support**: Arabic (default) and English with easy language switching
- 🛍️ **Product Catalog**: Public-facing product listing with search and filters
- 🔐 **Admin Panel**: Secure admin area for managing products
- 📸 **Image Upload**: Product image management via Supabase Storage
- 🎨 **Modern Design**: Logo-inspired cool blue/metallic color scheme
- 📱 **Responsive**: Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **Icons**: Lucide React

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vegnmkhjmuxinqgeaqkk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_BcevuDWuCL2t_DL2cNmmmg_PuCNqkQx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44
```

### 2. Supabase Database Setup

1. Go to your Supabase Dashboard → SQL Editor
2. Run the SQL script from `supabase/schema.sql` to create the products table and policies

### 3. Supabase Storage Setup

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `product-images`
3. Set it to **Public** (so images can be accessed)
4. Configure bucket policies:
   - **Public Access**: Allow public read access
   - **Authenticated Upload**: Allow authenticated users to upload

### 4. Create Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter email and password for admin account
4. Save the credentials (you'll use them to log in at `/admin/login`)

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (public)/          # Public pages
│   │   ├── page.tsx       # Home/Product catalog
│   │   └── products/[id]/ # Product detail page
│   ├── admin/             # Admin panel (protected)
│   │   ├── login/         # Admin login
│   │   ├── page.tsx       # Admin dashboard
│   │   └── products/      # Product management
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/
│   ├── supabase/         # Supabase client configs
│   └── i18n.ts           # Translation utilities
└── supabase/
    └── schema.sql        # Database schema
```

## Product Fields

Each product includes:
1. بارد (Cold) - Boolean
2. ساخن (Hot) - Boolean
3. انفرتر (Inverter) - Boolean
4. القدرة (حصان) (Power HP) - Number
5. اللون (Color) - Text
6. سمارت (Smart) - Boolean
7. شاشة ديجيتال (Digital Screen) - Boolean
8. بلازما (تنقية الهواء) (Plasma/Air Purification) - Boolean
9. ذكاء اصطناعي (AI) - Boolean
10. مدة الضمان (سنة) (Warranty Years) - Number
11. مواضفات اضافية (Additional Specifications) - Text (Bilingual)

## Admin Panel

Access the admin panel at `/admin` (requires authentication).

- **Dashboard**: Overview and quick actions
- **Products**: List, create, edit, and delete products
- **Image Upload**: Upload product images to Supabase Storage

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set the same environment variables in your hosting platform.

## License

ISC


