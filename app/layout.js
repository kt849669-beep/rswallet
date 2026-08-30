import './globals.css';

const siteUrl = 'https://rswallet.online';

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'RS Wallet',
  title: {
    default: 'RS Wallet Login | Official RS Wallet App India',
    template: '%s | RS Wallet',
  },
  description:
    'RS Wallet official website. Log in to your RS Wallet account, use the RS Wallet app on mobile, link UPI, check USDT rates and reach RS Wallet customer support. Made for users in India.',
  keywords: [
    'RS Wallet',
    'Rs wallet',
    'Rs Wallet login',
    'RS Wallet login',
    'Rs wallet app',
    'RS Wallet app download',
    'Rs wallet apk',
    'RS Wallet apk download',
    'Rs wallet official app',
    'RS Wallet official website',
    'Rs wallet customer support',
    'RS Wallet customer care',
    'Rs wallet account',
    'RS Wallet sign in',
    'Rs wallet online',
    'RS Wallet India',
    'Rs wallet UPI',
    'RS Wallet USDT rate',
    'RsWallet',
    'rswallet.online',
  ],
  authors: [{ name: 'RS Wallet', url: siteUrl }],
  creator: 'RS Wallet',
  publisher: 'RS Wallet',
  category: 'finance',
  alternates: {
    canonical: '/',
    languages: { 'en-IN': '/', 'x-default': '/' },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'RS Wallet Login | Official RS Wallet App India',
    description:
      'Official RS Wallet login. Access the RS Wallet app, UPI setup, USDT rates, rewards and RS Wallet customer support.',
    url: '/',
    siteName: 'RS Wallet',
    locale: 'en_IN',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'RS Wallet app login screen' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RS Wallet Login | Official RS Wallet App India',
    description: 'Official RS Wallet login and RS Wallet app access for users in India.',
    images: ['/og.png'],
  },
  icons: {
    icon: [{ url: '/rswallet-logo.png', type: 'image/png' }],
    apple: [{ url: '/rswallet-logo.png' }],
  },
  manifest: '/manifest.json',
  other: {
    'geo.region': 'IN',
    'geo.placename': 'India',
    'apple-mobile-web-app-title': 'RS Wallet',
    'apple-mobile-web-app-capable': 'yes',
    'format-detection': 'telephone=no',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0d4f49',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
