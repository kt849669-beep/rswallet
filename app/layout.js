import './globals.css';

export const metadata = {
  metadataBase: new URL('https://app-showpay.in'),
  title: 'ShowPay Login | Secure Account Access',
  description: 'Sign in to ShowPay to access your account dashboard and available payment tools through the mobile-friendly ShowPay web app.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'ShowPay Login | Secure Account Access',
    description: 'Sign in to access your ShowPay account dashboard and available payment tools.',
    url: '/',
    siteName: 'ShowPay',
    images: [{ url: '/showpay-logo.png', alt: 'ShowPay logo' }],
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
