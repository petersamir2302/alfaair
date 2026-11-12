import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

/**
 * Price management API.
 *
 * Auth: send header `Authorization: Bearer <PRICE_API_TOKEN>`.
 * Required env vars on the host: PRICE_API_TOKEN, SUPABASE_SERVICE_ROLE_KEY.
 *
 * GET   /api/admin/prices  -> list products with their current prices
 * POST  /api/admin/prices  -> body: { creates: [{ template_id, name_ar, name_en, ...fields }] }
 *                              copies the template product and overrides the given fields;
 *                              skipped when a product with the same name_en already exists
 * PATCH /api/admin/prices  -> body: { updates: [{ id, price, price_before?, name_ar?, name_en?,
 *                              description_ar?, description_en?, cold?, hot?, inverter?, images? }] }
 *                              (images also sets image_url to the first image)
 */

export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.PRICE_API_TOKEN;
  if (!expected || expected.length < 32) return false;
  const header = request.headers.get('authorization') ?? '';
  const provided = header.startsWith('Bearer ') ? header.slice(7) : '';
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const unauthorized = () =>
  NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, name_ar, name_en, description_ar, description_en, power_hp, cold, hot, inverter, price, price_before, image_url, images, brand_id, category_id, brands(name_ar, name_en)'
    )
    .order('name_ar');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const { data: categories } = await supabase.from('categories').select('id, name_ar, name_en');
  return NextResponse.json({ products: data, categories: categories ?? [] });
}

type PriceUpdate = {
  id: string;
  price: number | null;
  price_before?: number | null;
  name_ar?: string;
  name_en?: string;
  description_ar?: string | null;
  description_en?: string | null;
  cold?: boolean;
  hot?: boolean;
  inverter?: boolean;
  images?: string[];
};

function isValidImages(v: unknown): boolean {
  if (v === undefined) return true;
  return Array.isArray(v) && v.length > 0 && v.length <= 12 &&
    v.every((x) => typeof x === 'string' && x.length <= 2000 && (x.startsWith('/') || x.startsWith('https://')));
}

const TEXT_FIELDS = ['name_ar', 'name_en', 'description_ar', 'description_en'] as const;
const FLAG_FIELDS = ['cold', 'hot', 'inverter'] as const;

function isValidText(v: unknown, nullable: boolean): boolean {
  if (v === undefined) return true;
  if (v === null) return nullable;
  return typeof v === 'string' && v.trim().length > 0 && v.length <= 20_000;
}

function isValidPrice(v: unknown): v is number | null {
  return v === null || (typeof v === 'number' && Number.isFinite(v) && v > 0 && v < 10_000_000);
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const updates = (body as { updates?: unknown })?.updates;
  if (!Array.isArray(updates) || updates.length === 0 || updates.length > 200) {
    return NextResponse.json(
      { error: 'Body must be { updates: [{ id, price, price_before?, ...optional fields }] } (1-200 items)' },
      { status: 400 }
    );
  }

  for (const u of updates as PriceUpdate[]) {
    if (typeof u?.id !== 'string' || !isValidPrice(u.price) ||
        (u.price_before !== undefined && !isValidPrice(u.price_before)) ||
        !isValidText(u.name_ar, false) || !isValidText(u.name_en, false) ||
        !isValidText(u.description_ar, true) || !isValidText(u.description_en, true) ||
        FLAG_FIELDS.some((k) => u[k] !== undefined && typeof u[k] !== 'boolean') ||
        !isValidImages(u.images)) {
      return NextResponse.json({ error: 'Invalid update item', item: u }, { status: 400 });
    }
  }

  const supabase = createAdminClient();
  const results = await Promise.all(
    (updates as PriceUpdate[]).map((u) => {
      const fields: Record<string, number | null | string | boolean | string[]> = {
        price: u.price,
        updated_at: new Date().toISOString(),
      };
      if (u.price_before !== undefined) fields.price_before = u.price_before;
      for (const k of TEXT_FIELDS) if (u[k] !== undefined) fields[k] = u[k] as string | null;
      for (const k of FLAG_FIELDS) if (u[k] !== undefined) fields[k] = u[k] as boolean;
      if (u.images !== undefined) {
        fields.images = u.images;
        fields.image_url = u.images[0];
      }
      return supabase
        .from('products')
        .update(fields)
        .eq('id', u.id)
        .select('id, name_ar, name_en, cold, hot, inverter, price, price_before');
    })
  );

  const failed = results
    .map((r, i) => ({ id: (updates as PriceUpdate[])[i].id, error: r.error?.message, found: (r.data?.length ?? 0) > 0 }))
    .filter((r) => r.error || !r.found);

  return NextResponse.json(
    {
      updated: results.flatMap((r) => r.data ?? []),
      failed,
    },
    { status: failed.length ? 207 : 200 }
  );
}

const CREATE_FIELDS = [
  'name_ar', 'name_en', 'description_ar', 'description_en', 'cold', 'hot', 'inverter',
  'power_hp', 'price', 'price_before', 'images', 'category_id', 'coverage_area_sqm',
  'additional_specs_ar', 'additional_specs_en', 'smart', 'digital_screen', 'plasma', 'ai',
] as const;

type CreateItem = { template_id: string } & Partial<Record<(typeof CREATE_FIELDS)[number], unknown>>;

function validCreate(c: CreateItem): boolean {
  if (typeof c?.template_id !== 'string') return false;
  if (!isValidText(c.name_ar, false) || !isValidText(c.name_en, false) || !c.name_ar || !c.name_en) return false;
  if (!isValidText(c.description_ar, true) || !isValidText(c.description_en, true)) return false;
  if (c.price !== undefined && !isValidPrice(c.price)) return false;
  if (c.price_before !== undefined && !isValidPrice(c.price_before)) return false;
  if (c.power_hp !== undefined && !(typeof c.power_hp === 'number' && c.power_hp > 0 && c.power_hp < 100)) return false;
  if (!isValidImages(c.images)) return false;
  for (const k of ['cold', 'hot', 'inverter', 'smart', 'digital_screen', 'plasma', 'ai'] as const) {
    if (c[k] !== undefined && typeof c[k] !== 'boolean') return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const creates = (body as { creates?: unknown })?.creates;
  if (!Array.isArray(creates) || creates.length === 0 || creates.length > 100) {
    return NextResponse.json({ error: 'Body must be { creates: [...] } (1-100 items)' }, { status: 400 });
  }
  for (const c of creates as CreateItem[]) {
    if (!validCreate(c)) return NextResponse.json({ error: 'Invalid create item', item: c }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: existing, error: exErr } = await supabase.from('products').select('id, name_en');
  if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 });
  const byName = new Map((existing ?? []).map((p) => [String(p.name_en).trim().toLowerCase(), p.id]));

  const created: { id: string; name_en: string }[] = [];
  const skipped: { id: string; name_en: string }[] = [];
  const failed: { name_en: unknown; error: string }[] = [];

  for (const c of creates as CreateItem[]) {
    const key = String(c.name_en).trim().toLowerCase();
    const dup = byName.get(key);
    if (dup) {
      skipped.push({ id: dup, name_en: String(c.name_en) });
      continue;
    }
    const { data: tpl, error: tErr } = await supabase.from('products').select('*').eq('id', c.template_id).single();
    if (tErr || !tpl) {
      failed.push({ name_en: c.name_en, error: tErr?.message ?? 'template not found' });
      continue;
    }
    const row: Record<string, unknown> = { ...tpl };
    delete row.id;
    delete row.created_at;
    delete row.updated_at;
    delete row.brands;
    row.best_seller = false;
    for (const k of CREATE_FIELDS) if (c[k] !== undefined) row[k] = c[k];
    if (Array.isArray(c.images)) row.image_url = c.images[0];
    const { data: ins, error: iErr } = await supabase.from('products').insert(row).select('id, name_en').single();
    if (iErr || !ins) {
      failed.push({ name_en: c.name_en, error: iErr?.message ?? 'insert failed' });
      continue;
    }
    byName.set(key, ins.id);
    created.push(ins);
  }

  return NextResponse.json({ created, skipped, failed }, { status: failed.length ? 207 : 200 });
}
