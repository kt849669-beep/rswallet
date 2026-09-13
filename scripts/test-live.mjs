import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const origin = process.env.RSWALLET_TEST_ORIGIN ?? 'http://localhost:3100';
assert.equal(new URL(origin).hostname, 'localhost');
assert.notEqual(new URL(origin).port, '3000', 'Run against an isolated test server, not the user demo.');
let cookie = '';
async function request(path, method = 'GET', body, extra = {}) {
  const response = await fetch(origin + path, { method, redirect: 'manual', headers: { Cookie: cookie, ...(method === 'GET' ? {} : { Origin: origin, 'Content-Type': 'application/json' }), ...extra }, body: body === undefined ? undefined : JSON.stringify(body) });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  return response;
}
async function homeDenied() {
  const response = await request('/home');
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('location'), '/login');
  await response.text();
}
await homeDenied();
cookie = 'rswallet_demo_session=11111111-1111-4111-8111-111111111111';
await homeDenied(); cookie = '';
assert.equal((await request('/api/session', 'POST', { step: 'mpin', pin: '123456' })).status, 401);
assert.equal((await request('/api/session', 'POST', { step: 'begin' }, { Origin: 'https://untrusted.example' })).status, 403);
let response = await request('/api/session', 'POST', { step: 'begin', phone: '7777777777' });
assert.equal(response.status, 200);
assert.match(response.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/);
const pendingCookie = cookie;
await homeDenied();
assert.equal((await request('/api/session', 'POST', { step: 'mpin', pin: '12' })).status, 400);
assert.equal((await request('/api/session', 'POST', { step: 'mpin', pin: '123456' })).status, 200);
assert.notEqual(cookie, pendingCookie, 'Rotate the token after MPIN.');
response = await request('/home'); assert.equal(response.status, 200); assert.match(await response.text(), /USDT Ratio/);
assert.equal((await (await request('/api/session')).json()).authenticated, true);
const activeCookie = cookie;
assert.equal((await request('/api/session', 'DELETE')).status, 200);
cookie = activeCookie; await homeDenied(); cookie = '';
console.log('PASS: anonymous/forged/pending Home blocked, login → MPIN → Home, token rotation, logout and cross-origin protection.');

assert.equal((await request('/api/admin/auth', 'POST', { email: 'admin@rswallet.com', password: 'admin@01234' })).status, 200);
const admin = await (await request('/api/admin/content')).json();
assert.equal(admin.localPreview, true);
assert.equal(admin.content.revision, 0, 'The isolated test database must start empty.');
const form = new FormData();
form.append('file', new File([readFileSync('public/rswallet-logo.jpeg')], 'live-test.jpeg', { type: 'image/jpeg' }));
response = await fetch(origin + '/api/admin/media', { method: 'POST', headers: { Origin: origin, Cookie: cookie }, body: form });
assert.equal(response.status, 201);
const { asset } = await response.json();
let content = admin.content;
async function save(patch) {
  response = await request('/api/admin/content', 'PUT', { ...content, ...patch });
  assert.equal(response.status, 200, await response.clone().text());
  content = (await response.json()).content;
  return content;
}
const abort = new AbortController();
response = await fetch(origin + '/api/content/stream', { signal: abort.signal });
assert.match(response.headers.get('content-type'), /text\/event-stream/);
const snapshots = [];
const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
const consume = (async () => {
  let buffer = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += value;
      let boundary;
      while ((boundary = buffer.indexOf('\n\n')) >= 0) {
        const event = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2);
        const data = event.split('\n').find(line => line.startsWith('data: '));
        if (data) snapshots.push(JSON.parse(data.slice(6)));
      }
    }
  } catch (error) { if (!abort.signal.aborted) throw error; }
})();
async function next(predicate) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    while (snapshots.length) { const item = snapshots.shift(); if (predicate(item)) return item; }
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  throw new Error('Timed out waiting for live content.');
}
try {
  await next(item => item.revision === 0);
  const started = Date.now();
  await save({ slides: [{ assetId: asset.id, enabled: true }], homeBanner: { enabled: true, assetId: asset.id }, popup: { enabled: true, assetId: asset.id, title: 'Live image' }, telegram: { enabled: true, title: 'Live Telegram', message: 'Test update', url: 'https://t.me/rswallet_demo' } });
  const first = await next(item => item.revision === content.revision);
  assert.equal(first.homeBanner.asset.id, asset.id); assert.equal(first.popup.asset.id, asset.id); assert.equal(first.telegram.enabled, true); assert.equal(first.slides.length, 1);
  console.log(`PASS: saved content reached SSE in ${Date.now() - started} ms.`);
  const versions = first.presentationVersions;
  await save({ homeBanner: { ...content.homeBanner, enabled: false }, popup: { ...content.popup, enabled: false }, telegram: { ...content.telegram, enabled: false } });
  const off = await next(item => item.revision === content.revision);
  assert.equal(off.homeBanner.enabled, false); assert.equal(off.popup.enabled, false); assert.equal(off.telegram.enabled, false); assert.equal(off.slides.length, 1);
  await save({ homeBanner: { ...content.homeBanner, enabled: true }, popup: { ...content.popup, enabled: true }, telegram: { ...content.telegram, enabled: true } });
  const on = await next(item => item.revision === content.revision);
  for (const key of ['homeBanner', 'popup', 'telegram']) assert.ok(on.presentationVersions[key] > versions[key]);
  const prior = { ...content.presentationVersions };
  await save({ slidesEnabled: false });
  const slidesOff = await next(item => item.revision === content.revision);
  assert.equal(slidesOff.slidesEnabled, false); assert.deepEqual(slidesOff.presentationVersions, prior, 'Unrelated slideshow saves must not reopen dismissed popups.');
  assert.equal((await request('/api/admin/content', 'PUT', { ...content, revision: content.revision - 1 })).status, 409);
  assert.equal((await request('/api/admin/media', 'PATCH', { id: asset.id, deleted: true })).status, 200);
  await next(item => item.homeBanner.asset === null && item.popup.asset === null);
  assert.equal((await request('/api/admin/media', 'PATCH', { id: asset.id, deleted: false })).status, 200);
  await next(item => item.homeBanner.asset?.id === asset.id && item.popup.asset?.id === asset.id);
  console.log('PASS: live ON/OFF, popup activation versions, independent slides, stale-write rejection, media Trash/restore.');
} finally { abort.abort(); await consume; }
