export interface Brand {
  id: string;
  name_ar: string;
  name_en: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  icon: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  cold: boolean;
  hot: boolean;
  inverter: boolean;
  power_hp: number | null;
  color: string | null;
  smart: boolean;
  digital_screen: boolean;
  plasma: boolean;
  ai: boolean;
  best_seller: boolean;
  warranty_years: number | null;
  price: number | null;
  price_before: number | null;
  inventory: number | null;
  coverage_area_sqm: number | null;
  additional_specs_ar: string | null;
  additional_specs_en: string | null;
  image_url: string | null;
  images: string[] | null;
  brand_id: string | null;
  category_id: string | null;
  order: number | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  content_ar: string;
  content_en: string;
  author: string;
  published_at: string;
  image_url: string | null;
  category: 'tips' | 'maintenance' | 'buying-guide' | 'energy-saving';
  created_at: string;
  updated_at: string;
}
