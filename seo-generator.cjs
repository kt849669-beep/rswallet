const fs = require('fs');
const path = require('path');

const domain = 'https://app-showpay.in';
const publicDir = path.join(__dirname, 'public');
const socialImage = `${domain}/showpay-logo.png`;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function writeIfChanged(filePath, content) {
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === content) {
    return false;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

const pages = [
  {
    filename: 'about-showpay.html',
    title: 'About ShowPay | App, Login and Payment Platform',
    description:
      'Learn about ShowPay, its secure account login, mobile-friendly web app and available payment and wallet features.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': `${domain}/about-showpay.html#webpage`,
      url: `${domain}/about-showpay.html`,
      name: 'About ShowPay',
      description:
        'Information about ShowPay account access, the web app and available payment features.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${domain}/#website`,
        url: `${domain}/`,
        name: 'ShowPay',
      },
      about: {
        '@type': 'Organization',
        '@id': `${domain}/#organization`,
        name: 'ShowPay',
        url: `${domain}/`,
        logo: socialImage,
      },
    },
    body: `
      <h1>About ShowPay</h1>
      <p>ShowPay provides mobile-friendly account access for viewing the payment and wallet features available to each user. The main <strong>ShowPay login</strong> is available on this domain.</p>
      <h2>Using the ShowPay app</h2>
      <p>The <strong>ShowPay app</strong> experience is delivered through a responsive web interface. After signing in, users can view the tools enabled for their account and follow the instructions shown in the dashboard.</p>
      <h2>Account access</h2>
      <p>Use the main login page and keep your password and MPIN private. If you cannot access your account, use the password-recovery option shown on the login screen.</p>
      <p>Read about <a href="/showpay-apk.html">ShowPay app and APK access</a>, visit <a href="/showpay-support.html">ShowPay support</a>, or continue to the <a href="/">ShowPay login</a>.</p>
    `,
  },
  {
    filename: 'showpay-apk.html',
    title: 'ShowPay APK and App Access | ShowPay Login',
    description:
      'Find safe ShowPay app access information, sign in through the web login and avoid unverified ShowPay APK download sources.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${domain}/showpay-apk.html#webpage`,
      url: `${domain}/showpay-apk.html`,
      name: 'ShowPay APK and App Access',
      description:
        'Safe access information for the ShowPay app, web login and APK-related searches.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${domain}/#website`,
        url: `${domain}/`,
        name: 'ShowPay',
      },
    },
    body: `
      <h1>ShowPay App and APK Access</h1>
      <p>The <strong>ShowPay app</strong> can be accessed through the mobile-friendly web login on this domain. This page does not currently host a direct <strong>ShowPay APK</strong> file.</p>
      <h2>Safe ShowPay login</h2>
      <p>Use the <a href="/">ShowPay login</a> page in your browser. Check that the address begins with <strong>https://app-showpay.in/</strong> before entering account details.</p>
      <h2>Avoid unverified APK files</h2>
      <p>Do not install files from unknown websites or messages claiming to provide a Show Pay app download. An unverified APK can expose passwords, MPINs or other account information.</p>
      <p>For account-access questions, visit <a href="/showpay-support.html">ShowPay support</a>.</p>
    `,
  },
  {
    filename: 'showpay-support.html',
    title: 'ShowPay Support | Login and App Help',
    description:
      'Get ShowPay login and app help, including password recovery guidance, account-safety tips and USDT transaction checks.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${domain}/showpay-support.html#faq`,
      url: `${domain}/showpay-support.html`,
      name: 'ShowPay Support',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I recover my ShowPay login?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Use the password-recovery option shown on the ShowPay login screen and never share your password or MPIN.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should I check for a pending ShowPay USDT transaction?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Confirm the selected network, destination address and blockchain confirmations, then review the status shown in your dashboard.',
          },
        },
      ],
    },
    body: `
      <h1>ShowPay Support</h1>
      <p>Use these steps for common <strong>ShowPay login</strong>, app-access and transaction questions.</p>
      <h2>Frequently asked questions</h2>
      <h3>How do I recover my ShowPay login?</h3>
      <p>Use the password-recovery option shown on the ShowPay login screen. Never share your password or MPIN with another person.</p>
      <h3>What should I check for a pending ShowPay USDT transaction?</h3>
      <p>Confirm the selected network, destination address and blockchain confirmations, then review the status shown in your dashboard.</p>
      <p>For platform information, read <a href="/about-showpay.html">About ShowPay</a>. For safe web-app access, see the <a href="/showpay-apk.html">ShowPay app and APK guide</a>.</p>
    `,
  },
  {
    filename: 'showpay-usdt.html',
    title: 'ShowPay USDT Guide | Deposit and Withdrawal Checks',
    description:
      'Use this ShowPay USDT guide to verify networks, wallet addresses and transaction status before a deposit or withdrawal.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': `${domain}/showpay-usdt.html#howto`,
      url: `${domain}/showpay-usdt.html`,
      name: 'How to check a ShowPay USDT deposit',
      description:
        'Steps for checking network and address information before a ShowPay USDT transaction.',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Sign in',
          text: 'Open the ShowPay login page and sign in to your account.',
        },
        {
          '@type': 'HowToStep',
          name: 'Verify the network and address',
          text: 'Open the available USDT option and carefully verify the displayed network and wallet address.',
        },
        {
          '@type': 'HowToStep',
          name: 'Review transaction status',
          text: 'After submitting a transaction, review its status and required blockchain confirmations.',
        },
      ],
    },
    body: `
      <h1>ShowPay USDT Guide</h1>
      <p>This guide explains the checks to make before using a USDT feature available in the <strong>ShowPay app</strong>.</p>
      <h2>Before a USDT deposit</h2>
      <ol>
        <li>Open the <a href="/">ShowPay login</a> page and sign in.</li>
        <li>Open the available USDT option and verify the displayed network.</li>
        <li>Compare the full wallet address before sending funds.</li>
      </ol>
      <h2>Transaction status</h2>
      <p>Processing time can vary by network activity and required blockchain confirmations. Review the transaction status shown in your dashboard before taking another action.</p>
      <p>For account-access or transaction questions, visit <a href="/showpay-support.html">ShowPay support</a>.</p>
    `,
  },
];

const styles = `
      :root { color-scheme: light; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      * { box-sizing: border-box; }
      body { margin: 0; background: #f5f7fa; color: #1f2937; line-height: 1.7; }
      main { width: min(760px, calc(100% - 32px)); margin: 32px auto; padding: 28px; background: #fff; border-radius: 16px; box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08); }
      h1, h2, h3 { color: #111827; line-height: 1.25; }
      h1 { font-size: clamp(1.8rem, 6vw, 2.5rem); }
      h2 { margin-top: 2rem; }
      a { color: #0369a1; text-underline-offset: 3px; }
      li + li { margin-top: .55rem; }
      @media (max-width: 560px) { main { margin: 16px auto; padding: 20px; border-radius: 12px; } }
`;

for (const page of pages) {
  const canonical = `${domain}/${page.filename}`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" href="/showpay-logo.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="ShowPay" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${socialImage}" />
    <meta property="og:image:alt" content="ShowPay logo" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.description}" />
    <meta name="twitter:image" content="${socialImage}" />
    <script type="application/ld+json">${JSON.stringify(page.schema)}</script>
    <style>${styles}</style>
  </head>
  <body>
    <main>
${page.body.trim()}
    </main>
  </body>
</html>
`;

  writeIfChanged(path.join(publicDir, page.filename), html);
}

const robots = `User-agent: *
Disallow: /admin
Disallow: /admin-app/
Allow: /

Sitemap: ${domain}/sitemap.xml
`;

writeIfChanged(path.join(publicDir, 'robots.txt'), robots);
require('./generate-sitemap.cjs');

console.log('SEO pages, robots.txt and sitemap.xml generated successfully.');
