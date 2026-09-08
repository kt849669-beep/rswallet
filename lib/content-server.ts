import { env } from 'cloudflare:workers';
import { defaultContent, type ContentSettings, type MediaAsset } from './site-content';

type Bindings = { DB: D1Database; MEDIA: R2Bucket; ADMIN_EMAIL?: string; LOCAL_CONTENT_ADMIN?: string };
export const bindings = () => env as unknown as Bindings;
export const noStore = { 'Cache-Control': 'no-store, private', 'X-Content-Type-Options': 'nosniff' };
export function json(value: unknown, status = 200) { return Response.json(value, { status, headers: noStore }); }

export function adminIdentity(h: Headers) {
  const runtime = bindings();
  const localPreview = import.meta.env.DEV && runtime.LOCAL_CONTENT_ADMIN === 'true' && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(h.get('host') ?? '');
  const email = h.get('oai-authenticated-user-email')?.toLowerCase();
  const signedIn = !!h.get('oai-authenticated-user-id') && !!email;
  return { allowed: localPreview || (signedIn && !!runtime.ADMIN_EMAIL && email === runtime.ADMIN_EMAIL.toLowerCase()), signedIn, localPreview };
}
export function guardAdmin(request: Request, mutation = false): Response | null {
  const identity = adminIdentity(request.headers);
  if (!identity.allowed) return json({ error: identity.signedIn ? 'This account cannot edit this site.' : 'Sign in with the site owner’s ChatGPT account.' }, identity.signedIn ? 403 : 401);
  if (mutation) {
    const origin = request.headers.get('origin');
    if (!origin || origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return json({ error: 'This request must start in your admin panel.' }, 403);
  }
  return null;
}
export async function readContent(): Promise<ContentSettings> {
  const row = await bindings().DB.prepare('SELECT revision, document, updated_at FROM site_content WHERE id = 1').first<{ revision: number; document: string; updated_at: string }>();
  return row ? { ...JSON.parse(row.document), revision: row.revision, updatedAt: row.updated_at } : defaultContent();
}
export async function readAssets(): Promise<MediaAsset[]> {
  const result = await bindings().DB.prepare('SELECT id, name, type, size, created_at AS createdAt, deleted_at AS deletedAt FROM content_media ORDER BY created_at DESC LIMIT 250').all<MediaAsset>();
  return result.results;
}
export async function writeContent(content: ContentSettings): Promise<boolean> {
  const document = JSON.stringify({ ...content, revision: content.revision + 1 });
  const timestamp = new Date().toISOString();
  const query = content.revision === 0
    ? bindings().DB.prepare('INSERT INTO site_content (id, revision, document, updated_at) VALUES (1, 1, ?, ?) ON CONFLICT(id) DO NOTHING').bind(document, timestamp)
    : bindings().DB.prepare('UPDATE site_content SET revision = revision + 1, document = ?, updated_at = ? WHERE id = 1 AND revision = ?').bind(document, timestamp, content.revision);
  return (await query.run()).meta.changes === 1;
}
