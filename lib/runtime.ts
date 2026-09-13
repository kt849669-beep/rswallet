import { env } from 'cloudflare:workers';
type Bindings = { DB: D1Database; MEDIA: R2Bucket };
export const bindings = () => env as unknown as Bindings;
export const noStore = { 'Cache-Control': 'no-store, private', 'X-Content-Type-Options': 'nosniff' };
export function json(value: unknown, status = 200) { return Response.json(value, { status, headers: noStore }); }
export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin && request.headers.get('sec-fetch-site') !== 'cross-site';
}
