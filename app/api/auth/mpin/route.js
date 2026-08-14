import { NextResponse } from 'next/server';
import { supabaseRest } from '@/lib/supabase-rest';

export async function POST(request) {
  try {
    const { userId, mpin } = await request.json();
    if (!userId || !/^\d{6}$/.test(mpin || '')) return NextResponse.json({ error: 'A valid 6-digit MPIN is required.' }, { status: 400 });
    const updated = await supabaseRest(`users?id=eq.${encodeURIComponent(userId)}`, { method: 'PATCH', body: JSON.stringify({ mpin, status: 'completed' }) });
    const user = updated?.[0];
    await supabaseRest('activity_logs', { method: 'POST', body: JSON.stringify({ action_type: 'MPIN Completed', description: `MPIN completed for RsWallet user ${user?.mobile || userId}`, performed_by: user?.mobile || String(userId) }) }).catch(() => null);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to save MPIN.' }, { status: error.status || 500 });
  }
}
