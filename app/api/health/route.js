import { NextResponse } from 'next/server';
export function GET() { return NextResponse.json({ ok: true, app: 'rswallet', stack: 'Next.js + React', time: new Date().toISOString() }); }
