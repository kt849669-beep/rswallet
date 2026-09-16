import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Poppins } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const walletFont = Poppins({ variable: '--font-wallet', subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://app-web-rswallet-api.online'),
  title: 'RS Wallet - Login | RS Wallet App Download & USDT Deposit',
  description: 'RS Wallet official portal: Secure login, download RS Wallet app, instant USDT deposit, live rates and fast INR wallet transactions. Register and access your Rs Wallet account now.',
  applicationName: 'Rs Wallet',
  keywords: [
    'rs wallet',
    'rs wallet login',
    'rs wallet app download',
    'rs wallet usdt',
    'rs wallet deposit',
    'rs wallet official',
    'rs wallet register',
    'rs wallet app',
    'rs wallet online',
    'rs wallet apk',
    'rs wallet crypto',
    'rs wallet usdt to inr',
    'rs wallet sign in',
    'rs wallet account'
  ],
  alternates: { canonical: 'https://app-web-rswallet-api.online' },
  icons: {
    icon: [{ url: '/rswallet-logo.jpeg', type: 'image/jpeg' }],
    apple: [{ url: '/rswallet-logo.jpeg', type: 'image/jpeg' }],
  },
  openGraph: {
    title: 'RS Wallet - Login | RS Wallet App Download & USDT Deposit',
    description: 'RS Wallet official portal: Secure login, download RS Wallet app, instant USDT deposit, live rates and fast INR wallet transactions.',
    url: 'https://app-web-rswallet-api.online',
    siteName: 'RS Wallet',
    images: [{ url: '/og.png', width: 1536, height: 864, alt: 'RS Wallet — Simple. Secure. Ready.' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RS Wallet - Login | RS Wallet App Download & USDT Deposit',
    description: 'RS Wallet official portal: Secure login, download RS Wallet app, instant USDT deposit, live rates and fast INR wallet transactions.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${walletFont.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
