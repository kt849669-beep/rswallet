import { bindings, guardAdmin, json } from '@/lib/content-server';
export const dynamic = 'force-dynamic';
const supported = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];

export async function POST(request: Request) {
  const denied = guardAdmin(request, true); if (denied) return denied;
  if (Number(request.headers.get('content-length')) > 27 * 1024 * 1024) return json({ error: 'Maximum upload size is 25 MB.' }, 413);
  try {
    // Cap the whole multipart stream before parsing it in the Worker isolate.
    const reader = request.body?.getReader(); if (!reader) return json({ error: 'Select a file.' }, 400);
    const chunks: Uint8Array[] = []; let total = 0;
    while (true) { const next = await reader.read(); if (next.done) break; total += next.value.byteLength; if (total > 27 * 1024 * 1024) { await reader.cancel(); return json({ error: 'Maximum upload size is 25 MB.' }, 413); } chunks.push(next.value); }
    const bytes = new Uint8Array(total); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; } chunks.length = 0;
    const form = await new Response(bytes, { headers: { 'Content-Type': request.headers.get('content-type') ?? '' } }).formData();
    const file = form.get('file');
    if (!(file instanceof File) || !supported.includes(file.type)) return json({ error: 'Use a JPG, PNG, WebP, GIF, MP4 or WebM file.' }, 400);
    const max = (file.type.startsWith('image/') ? 10 : 25) * 1024 * 1024;
    if (!file.size || file.size > max) return json({ error: 'Images can be up to 10 MB; videos up to 25 MB.' }, 400);
    const count = await bindings().DB.prepare('SELECT count(*) AS total FROM content_media').first<{ total: number }>();
    if ((count?.total ?? 0) >= 250) return json({ error: 'The library limit is 250 files.' }, 400);
    const signature = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const ascii = (start: number, end: number) => String.fromCharCode(...signature.slice(start, end));
    const matches = file.type === 'image/jpeg' ? signature[0] === 255 && signature[1] === 216 && signature[2] === 255
      : file.type === 'image/png' ? signature[0] === 137 && ascii(1, 4) === 'PNG'
      : file.type === 'image/webp' ? ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP'
      : file.type === 'image/gif' ? ascii(0, 3) === 'GIF'
      : file.type === 'video/mp4' ? ascii(4, 8) === 'ftyp'
      : signature[0] === 26 && signature[1] === 69 && signature[2] === 223 && signature[3] === 163;
    if (!matches) return json({ error: 'This file does not match its image or video format.' }, 400);
    const id = crypto.randomUUID(); const createdAt = new Date().toISOString();
    const name = file.name.replace(/[\u0000-\u001f]/g, '').slice(0, 160) || 'Upload';
    await bindings().MEDIA.put(id, file.stream(), { httpMetadata: { contentType: file.type } });
    try { await bindings().DB.prepare('INSERT INTO content_media (id, name, type, size, created_at) VALUES (?, ?, ?, ?, ?)').bind(id, name, file.type, file.size, createdAt).run(); }
    catch (error) { await bindings().MEDIA.delete(id); throw error; }
    return json({ asset: { id, name, type: file.type, size: file.size, createdAt, deletedAt: null } }, 201);
  } catch { return json({ error: 'Upload failed. Please select the file and try again.' }, 400); }
}
export async function PATCH(request: Request) {
  const denied = guardAdmin(request, true); if (denied) return denied;
  try {
    const value = await request.json() as { id: string; deleted: boolean };
    if (!/^[a-f0-9-]{36}$/.test(value.id) || typeof value.deleted !== 'boolean') return json({ error: 'Invalid file.' }, 400);
    const result = await bindings().DB.prepare('UPDATE content_media SET deleted_at = ? WHERE id = ?').bind(value.deleted ? new Date().toISOString() : null, value.id).run();
    return result.meta.changes ? json({ ok: true }) : json({ error: 'File not found.' }, 404);
  } catch { return json({ error: 'Unable to update this file.' }, 400); }
}
