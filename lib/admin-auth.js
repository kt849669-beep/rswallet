import { cookies } from 'next/headers';
import { supabaseRest } from './supabase-rest';

const encoder = new TextEncoder();

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_FALLBACK_PASSWORD;
}

async function signature(value) {
  const secret = sessionSecret();
  if (!secret) return null;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return Buffer.from(bytes).toString('base64url');
}

export async function createAdminSessionToken(email) {
  const payload = Buffer.from(JSON.stringify({ email, expiresAt: Date.now() + 12 * 60 * 60 * 1000 })).toString('base64url');
  const signed = await signature(payload);
  if (!signed) return crypto.randomUUID();
  return `${payload}.${signed}`;
}

async function verifySignedToken(token) {
  const [payload, supplied] = String(token || '').split('.');
  if (!payload || !supplied) return false;
  const expected = await signature(payload);
  if (!expected || expected !== supplied) return false;
  try {
    const value = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number(value.expiresAt) > Date.now();
  } catch { return false; }
}

export async function requireAdmin() {
  const token = (await cookies()).get('rswallet_admin_session')?.value;
  if (!token) return null;
  if (await verifySignedToken(token)) return token;
  const sessions = await supabaseRest(`admin_sessions?select=token&token=eq.${encodeURIComponent(token)}&limit=1`, { method: 'GET' }).catch(() => []);
  return sessions?.length ? token : null;
}
