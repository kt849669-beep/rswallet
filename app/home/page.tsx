import type { Metadata } from 'next';
import WalletApp from '../page';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readDemoSession, sessionCookieName } from '@/lib/demo-session';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'RS Wallet Home | USDT to INR Demo',
  description: 'Explore RS Wallet home in a mobile browser: sample USDT to INR ratio, rewards, balance, deposit, team and profile screens. Demonstration values only.',
  alternates: { canonical: '/home' },
};

export default async function HomePage() {
  const session = await readDemoSession((await cookies()).get(sessionCookieName)?.value);
  if (session?.phase !== 'active') redirect('/login');
  return <WalletApp initialScreen="home" />;
}
