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
      alternateName: ['Rs Wallet', 'Rs wallet', 'RsWallet', 'RS Wallet Login', 'RS Wallet App', 'RS Wallet app download', 'rs wallet apk download', 'RS Wallet official website', 'RS Wallet customer care', 'RS Wallet USDT rate'],
      description: 'Official RS Wallet website — RS Wallet login, app download, customer support, UPI and USDT rates for users in India.',
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
      <main className="login-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <header className="login-topbar">
            <h1>LOG IN<span className="sr-only"> — RS Wallet Login</span></h1>
          </header>
          <LoginForm />
        </div>
        
        <footer className="seo-footer" style={{ padding: '2rem 1rem', fontSize: '0.8rem', color: '#888', textAlign: 'center', lineHeight: '1.6', background: 'transparent' }}>
          <p>
            Welcome to the <strong>RS Wallet official website</strong> (`rswallet.online`). Access your account securely via the <strong>RS Wallet login</strong> portal. 
            Enjoy seamless transactions with the <strong>Rs Wallet app</strong>. For the best mobile experience, complete the <strong>RS Wallet app download</strong> or <strong>rs wallet apk download</strong> directly from our platform.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            Stay updated with the live <strong>RS Wallet USDT rate</strong> and easily link your <strong>rs wallet UPI</strong>. 
            If you need any assistance, our dedicated <strong>RS Wallet customer support</strong> and <strong>Rs Wallet customer care</strong> teams are here to help you.
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem' }}>&copy; {new Date().getFullYear()} RS Wallet (Original Brand). All Rights Reserved.</p>
        </footer>
      </main>
    </>
  );
}
