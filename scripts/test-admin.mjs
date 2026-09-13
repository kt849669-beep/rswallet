import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
const origin = process.env.RSWALLET_TEST_ORIGIN ?? 'http://localhost:3100';
assert.equal(new URL(origin).hostname, 'localhost'); assert.notEqual(new URL(origin).port, '3000');
let adminCookie = '', userCookie = '';
const testEmail = 'admin@rswallet.com', initialPassword = 'admin@01234', newPassword = 'test-admin-Changed@456';
async function request(path, method = 'GET', body, role = 'admin', extra = {}) {
  const response = await fetch(origin + path, { method, redirect: 'manual', headers: { Cookie: role === 'admin' ? adminCookie : role === 'user' ? userCookie : '', ...(method !== 'GET' ? { Origin: origin, 'Content-Type': 'application/json' } : {}), ...extra }, body: body === undefined ? undefined : JSON.stringify(body) });
  const cookie = response.headers.get('set-cookie')?.split(';')[0];
  if (cookie) { if (role === 'admin') adminCookie = cookie; if (role === 'user') userCookie = cookie; }
  return response;
}
async function data(path, method = 'GET', body, role = 'admin') {
  const response = await request(path, method, body, role);
  assert.equal(response.status, 200, await response.clone().text()); return response.json();
}
for (const path of ['/api/admin/content','/api/admin/users','/api/admin/reports?mode=all','/api/admin/auth']) assert.equal((await request(path, 'GET', undefined, 'none')).status, 401);
for (const path of ['/api/admin/content','/api/admin/media','/api/admin/profile']) assert.equal((await request(path, path.includes('content') ? 'PUT' : 'POST', {}, 'none')).status, 401);
assert.equal((await request('/api/admin/users', 'PATCH', { all: true, deleted: true }, 'none')).status, 401);
assert.equal((await request('/api/admin/content', 'GET', undefined, 'none', { 'oai-authenticated-user-id': 'spoof', 'oai-authenticated-user-email': testEmail })).status, 401);
assert.equal((await request('/api/admin/auth', 'POST', { email: testEmail, password: initialPassword }, 'admin', { Origin: 'https://untrusted.example' })).status, 403);
assert.equal((await request('/api/admin/auth', 'POST', { email: testEmail, password: 'wrong' })).status, 401);
await data('/api/admin/auth', 'POST', { email: testEmail, password: initialPassword });
assert.equal((await data('/api/admin/auth')).email, testEmail);
assert.equal((await request('/api/admin/content')).status, 200);
const oldSession = adminCookie;
await data('/api/admin/auth', 'POST', { email: testEmail, password: initialPassword });
assert.equal((await request('/api/admin/profile', 'POST', { oldPassword: 'wrong-old', newPassword, confirmPassword: newPassword })).status, 400);
assert.equal((await request('/api/admin/profile', 'POST', { oldPassword: initialPassword, newPassword, confirmPassword: newPassword + 'x' })).status, 400);
await data('/api/admin/profile', 'POST', { oldPassword: initialPassword, newPassword, confirmPassword: newPassword });
assert.equal((await request('/api/admin/auth', 'GET', undefined, 'none', { Cookie: oldSession })).status, 401);
assert.equal((await request('/api/admin/auth', 'POST', { email: testEmail, password: initialPassword })).status, 401);
await data('/api/admin/auth', 'POST', { email: testEmail, password: newPassword });
await data('/api/admin/profile', 'POST', { oldPassword: newPassword, newPassword: initialPassword, confirmPassword: initialPassword });
console.log('PASS: admin access, no localhost/header bypass, login, old-password check, confirmation, password change and session revocation.');

assert.equal((await data('/api/admin/users')).total, 0, 'Use a new isolated test database.');
const login = async phone => {
  await data('/api/session', 'POST', { step: 'begin', phone }, 'user');
  await data('/api/session', 'POST', { step: 'mpin', pin: '123456' }, 'user');
};
assert.equal((await request('/api/session', 'POST', { step: 'begin', phone: 'invalid' }, 'user')).status, 400);
await data('/api/session', 'POST', { step: 'begin', phone: '9999999999' }, 'user');
assert.equal((await data('/api/admin/users')).total, 0, 'Pending MPIN should not create a logged-in user.');
await data('/api/session', 'POST', { step: 'mpin', pin: '123456' }, 'user');
await login('9999999999'); await login('8888888888');
let users = await data('/api/admin/users'); assert.equal(users.total, 2);
assert.ok(users.users.every(user => /^[a-f0-9]{64}$/.test(user.mobileHash)));
assert.ok(!JSON.stringify(users).includes('9999999999') && !JSON.stringify(users).includes('8888888888'));
assert.deepEqual(users.users.map(user => user.loginCount).sort(), [1,2]);
const firstHash = users.users[0].mobileHash;
assert.equal((await data('/api/admin/users', 'PATCH', { deleted: true, ids: [firstHash] })).changed, 1);
assert.equal((await data('/api/admin/users')).total, 1); assert.equal((await data('/api/admin/users?trash=true')).total, 1);
assert.equal((await data('/api/admin/users', 'PATCH', { deleted: false, ids: [firstHash] })).changed, 1);
assert.equal((await data('/api/admin/users', 'PATCH', { deleted: true, all: true, exclude: [firstHash] })).changed, 1);
assert.equal((await data('/api/admin/users', 'PATCH', { deleted: false, all: true })).changed, 1);
assert.equal((await data('/api/admin/users', 'PATCH', { deleted: true, all: true })).changed, 2);
assert.equal((await data('/api/admin/users?trash=true')).total, 2);
assert.equal((await data('/api/admin/users', 'PATCH', { deleted: false, all: true })).changed, 2);
for (let i = 0; i < 18; i++) await login('9999999999');
console.log('PASS: only completed logins recorded, hashes only, repeat-login counts, single/all deletion, exclusions and Trash restore.');

mkdirSync('.wrangler/test-reports', { recursive: true });
const today = new Date(Date.now() + 330 * 60_000).toISOString().slice(0,10);
for (const [name, query] of [['all','mode=all'],['date',`mode=date&from=${today}&to=${today}`],['empty','mode=date&from=2000-01-01&to=2000-01-01']]) {
  const response = await request('/api/admin/reports?' + query); assert.equal(response.status,200,await response.clone().text());
  assert.match(response.headers.get('content-type'),/application\/pdf/); assert.match(response.headers.get('content-disposition'),/attachment/);
  writeFileSync(`.wrangler/test-reports/${name}.pdf`, Buffer.from(await response.arrayBuffer()));
}
assert.equal((await request('/api/admin/reports?mode=date&from=2026-02-30&to=2026-03-01')).status,400);
assert.equal((await request('/api/admin/reports?mode=date&from=2026-09-09&to=2026-09-01')).status,400);
writeFileSync('.wrangler/test-reports/expected.json', JSON.stringify({ hashes: users.users.map(user => user.mobileHash), logins: 21, today }));
console.log('PASS: all/date/empty PDF downloads, inclusive IST date range and invalid-date rejection.');
const previousCookie = adminCookie;
await data('/api/admin/auth','DELETE');
assert.equal((await request('/api/admin/users','GET',undefined,'none',{Cookie:previousCookie})).status,401);
console.log('PASS: admin logout revokes access.');
