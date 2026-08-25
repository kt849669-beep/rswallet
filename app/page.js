import LoginForm from '@/components/LoginForm';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rswallet.online';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: 'RS Wallet',
      alternateName: ['Rs Wallet', 'Rs wallet', 'RsWallet', 'RS Wallet Login', 'RS Wallet App'],
      description: 'Official RS Wallet website — RS Wallet login and RS Wallet app access for users in India.',
      inLanguage: 'en-IN',
      publisher: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'RS Wallet',
      alternateName: ['Rs Wallet', 'RsWallet'],
      url: `${siteUrl}/`,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/rswallet-logo.png`, width: 512, height: 512 },
      image: `${siteUrl}/og.png`,
      areaServed: { '@type': 'Country', name: 'India' },
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/#webpage`,
      url: `${siteUrl}/`,
      name: 'RS Wallet Login | Official RS Wallet App India',
      description: 'Log in to your RS Wallet account on the official RS Wallet website.',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'en-IN',
      primaryImageOfPage: { '@type': 'ImageObject', url: `${siteUrl}/og.png` },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteUrl}/#app`,
      name: 'RS Wallet',
      alternateName: ['Rs Wallet App', 'RS Wallet APK'],
      url: `${siteUrl}/`,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Android, iOS, Web',
      installUrl: `${siteUrl}/`,
      inLanguage: 'en-IN',
      publisher: { '@id': `${siteUrl}/#organization` },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
    },
  ],
};

export default function LoginPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="login-container">
        <header className="login-topbar">
          <h1>LOG IN<span className="sr-only"> — RS Wallet Login</span></h1>
        </header>
        <LoginForm />
      </main>
    </>
  );
}
