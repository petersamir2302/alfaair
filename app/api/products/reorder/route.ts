import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productOrders } = body; // Array of { id: string, order: number }

    if (!Array.isArray(productOrders)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Update all products in a transaction-like manner
    const updates = productOrders.map(({ id, order }: { id: string; order: number }) =>
      supabase
        .from('products')
        .update({ order })
        .eq('id', id)
    );

    const results = await Promise.all(updates);
    
    // Check for errors
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Failed to update some products', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


