import assert from 'node:assert/strict';
import http from 'node:http';

const origin = process.env.RSWALLET_TEST_ORIGIN ?? 'http://localhost:3100';
assert.equal(new URL(origin).hostname, 'localhost');
assert.notEqual(new URL(origin).port, '3000', 'Use an isolated test server.');
const login = await fetch(origin + '/api/admin/auth', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@rswallet.com', password: 'admin@01234' }) });
assert.equal(login.status, 200);
const cookie = login.headers.get('set-cookie').split(';')[0];
async function call(path, method = 'GET', body, extraHeaders = {}) {
  const response = await fetch(origin + path, { method, headers: { Cookie: cookie, ...(method === 'GET' ? {} : { Origin: origin, 'Content-Type': 'application/json' }), ...extraHeaders }, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await response.text();
  let result; try { result = JSON.parse(text); } catch { result = text; }
  return { status: response.status, body: result };
}
const start = await call('/api/admin/content');
assert.equal(start.status, 200);
assert.equal(start.body.localPreview, true, 'Run this test only against the local development preview.');
const original = structuredClone(start.body.content);
const asset = start.body.assets.find(a => !a.deletedAt);
assert.ok(asset, 'Run test-live.mjs first to create a test image in the isolated database.');
try {
  const anonymousStatus = await new Promise((resolve, reject) => {
    http.get(origin + '/api/admin/content', { headers: { Host: '127.0.0.2:3000' } }, response => { response.resume(); resolve(response.statusCode); }).on('error', reject);
  });
  assert.equal(anonymousStatus, 401);
  assert.equal((await call('/api/admin/content', 'PUT', original, { Origin: 'https://untrusted.example' })).status, 403);
  let edit = structuredClone(original);
  edit.telegram.enabled = true; edit.telegram.url = '';
  assert.equal((await call('/api/admin/content', 'PUT', edit)).status, 400);
  edit.telegram.url = 'https://untrusted.example';
  assert.equal((await call('/api/admin/content', 'PUT', edit)).status, 400);
  edit = structuredClone(original); edit.profileBanner = { enabled: true, assetId: asset.id };
  edit.homeBanner = { enabled: false, assetId: asset.id };
  edit.popup = { enabled: true, title: 'Test announcement', assetId: asset.id };
  const saved = await call('/api/admin/content', 'PUT', edit);
  assert.equal(saved.status, 200);
  assert.equal((await call('/api/admin/content', 'PUT', edit)).status, 409, 'Stale writes must not overwrite newer content.');
  let publicData = await call('/api/content');
  assert.equal(publicData.body.profileBanner.asset.id, asset.id);
  assert.equal(publicData.body.homeBanner.enabled, false);
  assert.equal(publicData.body.popup.title, 'Test announcement');
  assert.ok(!/password|mpin|secret|mobileNumber/.test(JSON.stringify(publicData.body)));
  const media = await fetch(origin + '/api/media/' + asset.id);
  assert.equal(media.status, 200); assert.equal(media.headers.get('Content-Type'), asset.type);
  const range = await fetch(origin + '/api/media/' + asset.id, { headers: { Range: 'bytes=0-15' } });
  assert.equal(range.status, 206); assert.equal((await range.arrayBuffer()).byteLength, 16);
  assert.equal((await call('/api/admin/media', 'PATCH', { id: asset.id, deleted: true })).status, 200);
  publicData = await call('/api/content'); assert.equal(publicData.body.profileBanner.asset, null);
  assert.equal((await fetch(origin + '/api/media/' + asset.id)).status, 404);
  assert.equal((await call('/api/admin/media', 'PATCH', { id: asset.id, deleted: false })).status, 200);
  publicData = await call('/api/content'); assert.equal(publicData.body.profileBanner.asset.id, asset.id);
  console.log('PASS: owner-only access, cross-origin protection, validation, durable content, conflict protection, media/ranges, Trash/restore, no credential fields.');
} finally {
  const current = await call('/api/admin/content');
  original.revision = current.body.content.revision;
  assert.equal((await call('/api/admin/content', 'PUT', original)).status, 200);
}
