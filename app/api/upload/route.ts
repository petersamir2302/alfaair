import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Determine content type based on file extension
    let contentType = file.type;
    if (fileExt === 'svg') {
      contentType = 'image/svg+xml';
    } else if (!contentType) {
      // Fallback content types
      const contentTypes: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'gif': 'image/gif',
      };
      contentType = contentTypes[fileExt || ''] || 'application/octet-stream';
    }

    // Convert File to ArrayBuffer for better control over content type
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: contentType });

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, blob, {
        contentType: contentType,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


