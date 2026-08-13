import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rswallet.vercel.app';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'RsWallet Login | Official RsWallet App',
  description: 'Use the official RsWallet login to access your mobile-friendly RsWallet dashboard, USDT tools, UPI features and account services.',
  keywords: ['RsWallet', 'Rswallet', 'RsWallet login', 'Rswallet app', 'Rs Wallet', 'RsWallet USDT', 'RsWallet UPI'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'RsWallet Login | Official RsWallet App',
    description: 'Access the official RsWallet login and mobile dashboard.',
    url: '/',
    siteName: 'RsWallet',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'RsWallet official app' }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'RsWallet Login | Official RsWallet App', description: 'Access the official RsWallet login and mobile dashboard.', images: ['/og.png'] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
