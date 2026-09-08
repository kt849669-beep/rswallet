import { json, readAssets, readContent } from '@/lib/content-server';
import { publicContent } from '@/lib/site-content';
export const dynamic = 'force-dynamic';
export async function GET() {
  try { const [content, assets] = await Promise.all([readContent(), readAssets()]); return json(publicContent(content, assets)); }
  catch { return json({ error: 'Content is temporarily unavailable.' }, 503); }
}
