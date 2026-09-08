import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Poppins } from 'next/font/google';
import './globals.css';

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
  metadataBase: new URL('https://rswallet-mobile-demo.mathurmonu62.chatgpt.site'),
  title: 'RS Wallet Login | Mobile Demo',
  description: 'Explore the RS Wallet mobile demo: login, MPIN, wallet home, profile and the USDT to INR display. Use test details for this browser preview.',
  applicationName: 'RsWallet Demo',
  keywords: ['rs wallet', 'rs wallet login', 'rs wallet official', 'rs wallet apk', 'rs wallet app download', 'rs wallet usdt to inr'],
  alternates: { canonical: '/login' },
  icons: {
    icon: [{ url: '/rswallet-logo.jpeg', type: 'image/jpeg' }],
    apple: [{ url: '/rswallet-logo.jpeg', type: 'image/jpeg' }],
  },
  openGraph: {
    title: 'RsWallet',
    description: 'Simple. Secure. Ready.',
    images: [{ url: '/og.png', width: 1536, height: 864, alt: 'RsWallet — Simple. Secure. Ready.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RsWallet',
    description: 'Simple. Secure. Ready.',
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
        {children}
      </body>
    </html>
  );
}
