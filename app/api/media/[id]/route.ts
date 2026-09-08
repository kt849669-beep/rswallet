import { bindings, json } from '@/lib/content-server';
export const dynamic = 'force-dynamic';
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/.test(id)) return json({ error: 'Not found.' }, 404);
  const row = await bindings().DB.prepare('SELECT type FROM content_media WHERE id = ? AND deleted_at IS NULL').bind(id).first<{ type: string }>();
  if (!row) return json({ error: 'Not found.' }, 404);
  const file = await bindings().MEDIA.get(id, { range: request.headers });
  if (!file) return json({ error: 'Not found.' }, 404);
  const headers = new Headers({ 'Content-Type': row.type, 'Cache-Control': 'public, max-age=60', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes', 'Content-Security-Policy': "default-src 'none'" });
  if (request.headers.has('range') && file.range && 'offset' in file.range) {
    const offset = file.range.offset ?? 0, length = file.range.length ?? file.size - offset;
    headers.set('Content-Range', `bytes ${offset}-${offset + length - 1}/${file.size}`); headers.set('Content-Length', String(length));
    return new Response(file.body, { status: 206, headers });
  }
  headers.set('Content-Length', String(file.size));
  return new Response(file.body, { headers });
}
