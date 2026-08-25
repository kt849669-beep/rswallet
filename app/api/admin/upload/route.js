import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseConfig } from '@/lib/supabase-rest';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await request.formData();
  const file = form.get('file');
  const resource = form.get('resource');
  if (!(file instanceof File) || !allowedTypes.has(file.type)) return NextResponse.json({ error: 'Choose a JPG, PNG, WebP or GIF image.' }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Image must be smaller than 8 MB.' }, { status: 400 });

  const bucket = resource === 'banners' ? 'banners' : 'slider_images';
  const extension = (file.name.split('.').pop() || 'jpg').replace(/[^a-z0-9]/gi, '').toLowerCase();
  const objectPath = `rswallet/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { baseUrl, anonKey } = getSupabaseConfig();
  const response = await fetch(`${baseUrl}/storage/v1/object/${bucket}/${objectPath}`, {
    method: 'POST',
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': file.type, 'x-upsert': 'false' },
    body: file,
  });
  if (!response.ok) {
    const details = await response.text();
    return NextResponse.json({ error: details || 'Unable to upload image.' }, { status: response.status });
  }
  return NextResponse.json({ url: `${baseUrl}/storage/v1/object/public/${bucket}/${objectPath}` });
}
