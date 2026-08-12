import LoginForm from '@/components/LoginForm';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://app-showpay.in/#website', url: 'https://app-showpay.in/', name: 'ShowPay', alternateName: ['Showpay', 'Show pay'] },
    { '@type': 'Organization', '@id': 'https://app-showpay.in/#organization', name: 'ShowPay', url: 'https://app-showpay.in/', logo: { '@type': 'ImageObject', url: 'https://app-showpay.in/showpay-logo.png' } },
    { '@type': 'WebPage', '@id': 'https://app-showpay.in/#webpage', url: 'https://app-showpay.in/', name: 'ShowPay Login', isPartOf: { '@id': 'https://app-showpay.in/#website' } },
  ],
};

export default function LoginPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="login-container">
        <h1 className="login-header">Login</h1>
        <LoginForm />
      </main>
    </>
  );
}
