import { adminIdentity, guardAdmin, json, readAssets, readContent, writeContent } from '@/lib/content-server';
import { validateContent } from '@/lib/site-content';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const denied = guardAdmin(request); if (denied) return denied;
  try { const [content, assets] = await Promise.all([readContent(), readAssets()]); return json({ content, assets, localPreview: adminIdentity(request.headers).localPreview }); }
  catch { return json({ error: 'Content could not be loaded. Please retry.' }, 503); }
}
export async function PUT(request: Request) {
  const denied = guardAdmin(request, true); if (denied) return denied;
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'JSON required.' }, 415);
  try {
    const raw = await request.text(); if (raw.length > 32768) return json({ error: 'Content is too large.' }, 413);
    const content = validateContent(JSON.parse(raw));
    const assets = await readAssets();
    const required = [...content.slides.map(s => s.assetId), content.homeBanner.assetId, content.profileBanner.assetId, content.popup.assetId].filter(Boolean);
    const existing = new Set(assets.map(a => a.id));
    if (required.some(id => !existing.has(id!))) return json({ error: 'One of the selected files no longer exists.' }, 400);
    const imageIds = [...content.slides.map(s => s.assetId), content.homeBanner.assetId, content.profileBanner.assetId].filter(Boolean);
    if (assets.some(a => imageIds.includes(a.id) && !a.type.startsWith('image/'))) return json({ error: 'Slides and banners require images.' }, 400);
    if (content.popup.enabled && assets.find(a => a.id === content.popup.assetId)?.deletedAt) return json({ error: 'Restore the popup file from Trash before enabling it.' }, 400);
    if (!await writeContent(content)) return json({ error: 'Content changed in another tab. Reload the latest version before saving.' }, 409);
    return json({ content: await readContent(), assets, localPreview: adminIdentity(request.headers).localPreview });
  } catch (error) { return json({ error: error instanceof Error && !error.message.includes('D1') ? error.message : 'Unable to save. Try again.' }, 400); }
}
