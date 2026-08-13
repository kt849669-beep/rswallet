import LoginForm from '@/components/LoginForm';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rswallet.vercel.app';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'RsWallet', alternateName: ['Rswallet', 'Rs Wallet', 'RsWallet Login'] },
    { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'RsWallet', url: `${siteUrl}/`, logo: { '@type': 'ImageObject', url: `${siteUrl}/rswallet-logo.png` } },
    { '@type': 'WebPage', '@id': `${siteUrl}/#webpage`, url: `${siteUrl}/`, name: 'RsWallet Login', isPartOf: { '@id': `${siteUrl}/#website` } },
  ],
};

export default function LoginPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="login-container">
        <h1 className="login-header">Log In</h1>
        <LoginForm />
      </main>
    </>
  );
}
