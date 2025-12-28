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
  warranty_years: number | null;
  price: number | null;
  additional_specs_ar: string | null;
  additional_specs_en: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}


