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
 * PATCH /api/admin/prices  -> body: { updates: [{ id, price, price_before? }] }
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
      'id, name_ar, name_en, power_hp, cold, hot, inverter, price, price_before, brands(name_ar, name_en)'
    )
    .order('name_ar');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ products: data });
}

type PriceUpdate = { id: string; price: number | null; price_before?: number | null };

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
      { error: 'Body must be { updates: [{ id, price, price_before? }] } (1-200 items)' },
      { status: 400 }
    );
  }

  for (const u of updates as PriceUpdate[]) {
    if (typeof u?.id !== 'string' || !isValidPrice(u.price) ||
        (u.price_before !== undefined && !isValidPrice(u.price_before))) {
      return NextResponse.json({ error: 'Invalid update item', item: u }, { status: 400 });
    }
  }

  const supabase = createAdminClient();
  const results = await Promise.all(
    (updates as PriceUpdate[]).map(({ id, price, price_before }) => {
      const fields: Record<string, number | null | string> = {
        price,
        updated_at: new Date().toISOString(),
      };
      if (price_before !== undefined) fields.price_before = price_before;
      return supabase.from('products').update(fields).eq('id', id).select('id, name_ar, price, price_before');
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
