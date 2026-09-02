import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RsWallet',
  description: 'RsWallet mobile wallet experience.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
