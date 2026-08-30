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
      <main className="login-container" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Full Screen Login Section */}
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <header className="login-topbar">
            <h1>LOG IN<span className="sr-only"> — RS Wallet Login</span></h1>
          </header>
          <LoginForm />
        </div>
        
        {/* SEO Content Section - Only visible if user scrolls down */}
        <section className="seo-content" style={{ padding: '3rem 1.5rem', background: '#f9f9f9', color: '#333', fontSize: '0.9rem', lineHeight: '1.6', borderTop: '1px solid #eaeaea' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>Welcome to the RS Wallet Official Website</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              <strong>RS Wallet</strong> is India's premier platform for managing your digital assets securely. Through the official <strong>rswallet.online</strong> portal, users can easily access their dashboard via the <strong>RS Wallet login</strong> page. Whether you're checking the live <strong>RS Wallet USDT rate</strong> or linking your <strong>RS Wallet UPI</strong>, our platform offers a seamless experience.
            </p>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: '#000' }}>RS Wallet App Download</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              For the best mobile experience, we highly recommend downloading our dedicated application. You can complete the <strong>RS Wallet app download</strong> directly from our site. Android users can specifically opt for the <strong>RS Wallet apk download</strong> to get the latest version (v2.1.0). The <strong>Rs Wallet app</strong> ensures you never miss out on our newbie rewards, top-up bonuses, and team commissions.
            </p>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: '#000' }}>RS Wallet Customer Support</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Got questions about your transactions or need help with your account? The <strong>RS Wallet customer support</strong> team is available 24/7. We pride ourselves on offering the best <strong>RS Wallet customer care</strong>. From queries regarding the current <strong>Rs Wallet USDT rate</strong> (e.g., 1 USDT ≈ 109.5 INR) to troubleshooting your <strong>Rs Wallet UPI</strong> binding, our official customer care representatives are just a click away.
            </p>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: '#000' }}>Frequently Asked Questions</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>How do I access my account?</strong> Go to the official <strong>RS Wallet login</strong> page on `rswallet.online` and enter your phone number and password.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Is the RS Wallet app free?</strong> Yes, the <strong>RS Wallet apk download</strong> is completely free for all users.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>How do I bind UPI?</strong> Log in to your Rs Wallet account, navigate to the UPI section, and click on "Bind UPI Now".</li>
            </ul>

            <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #ddd', fontSize: '0.8rem', color: '#666' }}>
              &copy; {new Date().getFullYear()} RS Wallet (Original Brand) | rswallet.online | All Rights Reserved.
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
