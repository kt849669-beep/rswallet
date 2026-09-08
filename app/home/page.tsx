import type { Metadata } from 'next';
import WalletApp from '../page';

export const metadata: Metadata = {
  title: 'RS Wallet Home | USDT to INR Demo',
  description: 'Explore RS Wallet home in a mobile browser: sample USDT to INR ratio, rewards, balance, deposit, team and profile screens. Demonstration values only.',
  alternates: { canonical: '/home' },
};

export default function HomePage() { return <WalletApp initialScreen="home" />; }
