import type { Metadata } from 'next';
import WalletApp from '../page';

export const metadata: Metadata = {
  title: 'RS Wallet Login | Mobile Demo',
  description: 'RS Wallet login demo with a 10-digit mobile number and six-digit MPIN flow. Explore the mobile preview using test details.',
  alternates: { canonical: '/login' },
};

export default function LoginPage() { return <WalletApp initialScreen="login" />; }
