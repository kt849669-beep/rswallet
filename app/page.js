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
      alternateName: ['Rs Wallet App', 'RS Wallet APK', 'rs wallet earning app'],
      url: `${siteUrl}/`,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Android, iOS, Web',
      installUrl: `${siteUrl}/`,
      inLanguage: 'en-IN',
      publisher: { '@id': `${siteUrl}/#organization` },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is RS Wallet real or fake?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'RS Wallet is a 100% genuine and trusted platform used by thousands of traders. We provide transparent RS Wallet USDT rates, real time crypto tracking, and secure settlements.',
          }
        },
        {
          '@type': 'Question',
          name: 'How to fix an RS Wallet withdrawal problem?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'If you ever face an rs wallet withdrawal problem, ensure your RS wallet UPI is bound correctly in the dashboard. Most withdrawals are processed instantly without issues.',
          }
        },
        {
          '@type': 'Question',
          name: 'How to complete the RS Wallet app download?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To get the official app, click on the Register Now button, create your account via rs wallet login, and you will see the rs wallet apk download link on your dashboard.',
          }
        },
        {
          '@type': 'Question',
          name: 'What is the RS Wallet customer care number?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For any queries, our rs wallet customer care number and dedicated customer support team can be reached directly via the official Telegram link inside the app dashboard.',
          }
        }
      ]
    }
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
