import type { Metadata } from 'next';
import WalletApp from '../page';

export const metadata: Metadata = {
  title: 'RS Wallet Login | RS Wallet App Download, USDT & Official Portal',
  description: 'Login to your RS Wallet account with mobile number and secure MPIN. Fast, secure crypto USDT deposit, bonus rewards and Rs Wallet app download.',
  keywords: [
    'rs wallet',
    'rs wallet login',
    'rs wallet app download',
    'rs wallet usdt',
    'rs wallet deposit',
    'rs wallet official',
    'rs wallet register',
    'rs wallet app',
    'rs wallet online'
  ],
  alternates: { canonical: 'https://app-web-rswallet-api.online/login' },
};

export default function LoginPage() { return <WalletApp initialScreen="login" />; }
