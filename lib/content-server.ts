import { bindings, json } from './runtime';
import { readAdminSession } from './admin-auth';
export { bindings, json, noStore } from './runtime';
import { defaultContent, type ContentSettings, type MediaAsset } from './site-content';

export async function adminIdentity(h: Headers) {
  const session = await readAdminSession(h);
  return { allowed: !!session, signedIn: !!session, localPreview: import.meta.env.DEV, email: session?.email };
}
export async function guardAdmin(request: Request, mutation = false): Promise<Response | null> {
  const identity = await adminIdentity(request.headers);
  if (!identity.allowed) return json({ error: 'Sign in to the admin panel.' }, 401);
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
  const result = await bindings().DB.prepare('SELECT id, name, type, size, created_at AS "createdAt", deleted_at AS "deletedAt" FROM content_media ORDER BY created_at DESC LIMIT 250').all<MediaAsset>();
  return result.results;
}
export async function writeContent(content: ContentSettings): Promise<boolean> {
  const previous = await readContent();
  if (previous.revision !== content.revision) return false;
  const version = (key: 'homeBanner' | 'telegram' | 'popup') => JSON.stringify(previous[key]) === JSON.stringify(content[key])
    ? previous.presentationVersions?.[key] ?? 0 : content.revision + 1;
  const presentationVersions = { homeBanner: version('homeBanner'), telegram: version('telegram'), popup: version('popup') };
  const document = JSON.stringify({ ...content, presentationVersions, revision: content.revision + 1 });
  const timestamp = new Date().toISOString();
  const query = content.revision === 0
    ? bindings().DB.prepare('INSERT INTO site_content (id, revision, document, updated_at) VALUES (1, 1, ?, ?) ON CONFLICT(id) DO NOTHING').bind(document, timestamp)
    : bindings().DB.prepare('UPDATE site_content SET revision = revision + 1, document = ?, updated_at = ? WHERE id = 1 AND revision = ?').bind(document, timestamp, content.revision);
  return (await query.run()).meta.changes === 1;
}
