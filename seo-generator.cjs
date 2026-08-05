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
  {
    filename: 'showpay-guide.html',
    title: 'ShowPay Guides | Login, App, USDT and Password Help',
    description:
      'Browse practical ShowPay guides for account login, app access, deposits, USDT network checks and password recovery help.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${domain}/showpay-guide.html#webpage`,
      url: `${domain}/showpay-guide.html`,
      name: 'ShowPay Guides',
      description: 'A collection of ShowPay account, app, deposit, USDT and password-help guides.',
      about: {
        '@type': 'Organization',
        '@id': `${domain}/#organization`,
        name: 'ShowPay',
        alternateName: ['Showpay', 'Show pay'],
        url: `${domain}/`,
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          `${domain}/how-to-use-showpay.html`,
          `${domain}/how-to-deposit-showpay.html`,
          `${domain}/how-to-deposit-usdt-showpay.html`,
          `${domain}/showpay-password-help.html`,
        ].map((url, index) => ({ '@type': 'ListItem', position: index + 1, url })),
      },
    },
    body: `
      <h1>ShowPay Guides</h1>
      <p><strong>ShowPay</strong> is also searched as “Showpay” or “Show pay”. These guides use the consistent brand spelling ShowPay and provide direct, task-focused help without changing the login or dashboard workflow.</p>
      <h2>Account and app access</h2>
      <ul>
        <li><a href="/how-to-use-showpay.html">How to use ShowPay</a></li>
        <li><a href="/showpay-apk.html">ShowPay app and APK access</a></li>
        <li><a href="/showpay-password-help.html">ShowPay password and login recovery help</a></li>
      </ul>
      <h2>Deposit and USDT guides</h2>
      <ul>
        <li><a href="/how-to-deposit-showpay.html">How to deposit on ShowPay</a></li>
        <li><a href="/how-to-deposit-usdt-showpay.html">How to deposit USDT on ShowPay</a></li>
        <li><a href="/showpay-usdt.html">ShowPay USDT network and transaction checks</a></li>
      </ul>
      <p class="notice">Account features can differ. Use only the options and transaction details shown inside your signed-in account, and verify every address or payment instruction before proceeding.</p>
    `,
  },
  {
    filename: 'how-to-use-showpay.html',
    title: 'How to Use ShowPay | Login and Account Guide',
    description:
      'Learn how to use ShowPay safely: open the correct login URL, sign in, review available account tools and find support when needed.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': `${domain}/how-to-use-showpay.html#howto`,
      url: `${domain}/how-to-use-showpay.html`,
      name: 'How to use ShowPay',
      description: 'Steps for opening the ShowPay login, signing in and using the tools available to an account.',
      step: [
        { '@type': 'HowToStep', name: 'Open ShowPay', text: 'Open https://app-showpay.in/ and check the address before entering account details.' },
        { '@type': 'HowToStep', name: 'Sign in', text: 'Enter the phone number and password associated with your own ShowPay account.' },
        { '@type': 'HowToStep', name: 'Review available tools', text: 'After signing in, use only the account tools and instructions displayed in the dashboard.' },
        { '@type': 'HowToStep', name: 'Get help safely', text: 'Use the password recovery or support guidance when an option is unavailable or unclear.' },
      ],
    },
    body: `
      <h1>How to Use ShowPay</h1>
      <p>Use the main <a href="/">ShowPay login</a> at <strong>https://app-showpay.in/</strong>. Check the full address before entering a phone number, password or other account information.</p>
      <h2>1. Sign in to your account</h2>
      <p>Enter the phone number and password connected to your own account. Do not share a password, OTP or MPIN with another person.</p>
      <h2>2. Review the available dashboard tools</h2>
      <p>Features may differ by account. Follow the labels and instructions displayed after login rather than relying on an old screenshot or message from an unknown source.</p>
      <h2>3. Use account help when needed</h2>
      <p>If you cannot sign in, read the <a href="/showpay-password-help.html">ShowPay password help guide</a>. For app-access questions, use the <a href="/showpay-support.html">ShowPay support guide</a>.</p>
      <p class="notice">This guide explains navigation only. It does not request account credentials and does not replace instructions shown inside your account.</p>
    `,
  },
  {
    filename: 'how-to-deposit-showpay.html',
    title: 'How to Deposit on ShowPay | Account Deposit Guide',
    description:
      'Follow safe checks for a ShowPay deposit: sign in, use the available deposit option, verify displayed details and review transaction status.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': `${domain}/how-to-deposit-showpay.html#howto`,
      url: `${domain}/how-to-deposit-showpay.html`,
      name: 'How to deposit on ShowPay',
      description: 'General safety steps for using a deposit option displayed in a ShowPay account.',
      step: [
        { '@type': 'HowToStep', name: 'Sign in', text: 'Open the main ShowPay login and sign in to your own account.' },
        { '@type': 'HowToStep', name: 'Open the available deposit option', text: 'Use the Deposit option only if it is displayed and active in your dashboard.' },
        { '@type': 'HowToStep', name: 'Verify the instructions', text: 'Review the displayed method, amount, recipient or wallet details before confirming anything.' },
        { '@type': 'HowToStep', name: 'Review status', text: 'Check the transaction status shown in the account before attempting another deposit.' },
      ],
    },
    body: `
      <h1>How to Deposit on ShowPay</h1>
      <p>Sign in through the main <a href="/">ShowPay login</a>, then use a Deposit option only when it is available in your account dashboard.</p>
      <h2>Check the displayed deposit method</h2>
      <p>Deposit methods and availability can vary. Read the current instructions inside the account and verify the amount, recipient, wallet address or payment reference before taking action.</p>
      <h2>Confirm the transaction status</h2>
      <p>After following the displayed process, review the status in your account. Do not repeat a payment only because an external message says the first one failed.</p>
      <h2>For USDT deposits</h2>
      <p>Network selection and wallet-address matching require additional checks. Read <a href="/how-to-deposit-usdt-showpay.html">how to deposit USDT on ShowPay</a> before using a crypto deposit option.</p>
      <p class="notice">Never send funds to details copied from an unofficial page, chat or screenshot. Use the current details shown inside your signed-in account.</p>
    `,
  },
  {
    filename: 'how-to-deposit-usdt-showpay.html',
    title: 'How to Deposit USDT on ShowPay | Network Safety Guide',
    description:
      'Check the network, wallet address and confirmation status before making a USDT deposit using an option available in your ShowPay account.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': `${domain}/how-to-deposit-usdt-showpay.html#howto`,
      url: `${domain}/how-to-deposit-usdt-showpay.html`,
      name: 'How to deposit USDT on ShowPay',
      description: 'Safety checks for a USDT deposit option displayed in a ShowPay account.',
      step: [
        { '@type': 'HowToStep', name: 'Open the account deposit option', text: 'Sign in and open the USDT or crypto deposit option only if it is available in the dashboard.' },
        { '@type': 'HowToStep', name: 'Match the network', text: 'Use the same supported network on the sending wallet and the ShowPay deposit screen.' },
        { '@type': 'HowToStep', name: 'Verify the complete address', text: 'Compare the full destination wallet address before sending USDT.' },
        { '@type': 'HowToStep', name: 'Review confirmations and status', text: 'After sending, review blockchain confirmations and the transaction status shown in the account.' },
      ],
    },
    body: `
      <h1>How to Deposit USDT on ShowPay</h1>
      <p>Open a USDT deposit option only after signing in through <a href="/">app-showpay.in</a>. Availability, supported networks and addresses can change, so the live account screen is the source to verify.</p>
      <h2>Match the USDT network</h2>
      <p>The network selected in the sending wallet must match the network displayed for the deposit. A network mismatch can cause a permanent loss of funds.</p>
      <h2>Check the complete wallet address</h2>
      <p>Compare the beginning, middle and end of the destination address. Do not rely only on the first or last few characters, and do not use an address received through an unknown message.</p>
      <h2>Wait for confirmations</h2>
      <p>Processing time depends on network activity and required confirmations. Review the transaction status before attempting another transfer.</p>
      <p>For broader checks, read the <a href="/showpay-usdt.html">ShowPay USDT guide</a> or the <a href="/how-to-deposit-showpay.html">general ShowPay deposit guide</a>.</p>
      <p class="notice">This page does not display or provide a deposit address. Always use the current address shown inside your own account.</p>
    `,
  },
  {
    filename: 'showpay-password-help.html',
    title: 'ShowPay Password Help | Reset and Login Recovery',
    description:
      'Use safe ShowPay password recovery guidance, open the recovery option from the login page and protect your password, OTP and MPIN.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${domain}/showpay-password-help.html#faq`,
      url: `${domain}/showpay-password-help.html`,
      name: 'ShowPay Password Help',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I reset my ShowPay password?',
          acceptedAnswer: { '@type': 'Answer', text: 'Open the main ShowPay login page and use its Forget Password option, then follow the recovery instructions shown there.' },
        },
        {
          '@type': 'Question',
          name: 'Should I share my ShowPay OTP or MPIN for password recovery?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. Never share your password, OTP or MPIN with another person or an unverified support contact.' },
        },
      ],
    },
    body: `
      <h1>ShowPay Password Help</h1>
      <p>If you cannot sign in, open the main <a href="/">ShowPay login</a> and use the <strong>Forget Password</strong> option shown on that page. Follow only the recovery instructions opened from the login screen.</p>
      <h2>Protect your account during recovery</h2>
      <ul>
        <li>Never send your current password, OTP or MPIN to another person.</li>
        <li>Check the website address before entering recovery information.</li>
        <li>Create a password that is not reused on another website.</li>
        <li>After recovery, sign in again from the main app-showpay.in login.</li>
      </ul>
      <h2>If recovery is unavailable</h2>
      <p>Do not create repeated requests or trust an unknown contact claiming to reset the account manually. Review the <a href="/showpay-support.html">ShowPay support guide</a> for safe next steps.</p>
      <p class="notice">This guide never asks for or stores a password. Password recovery remains part of the existing ShowPay login workflow.</p>
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
      .notice { margin-top: 1.5rem; padding: 14px 16px; border-left: 4px solid #0284c7; background: #f0f9ff; }
      .guide-nav { margin-top: 2.25rem; padding-top: 1.25rem; border-top: 1px solid #e5e7eb; }
      .guide-nav a + a { margin-left: 12px; }
      @media (max-width: 560px) { main { margin: 16px auto; padding: 20px; border-radius: 12px; } }
`;

const guideNavigation = `
      <nav class="guide-nav" aria-label="ShowPay guide navigation">
        <a href="/showpay-guide.html">All ShowPay guides</a>
        <a href="/about-showpay.html">About ShowPay</a>
        <a href="/showpay-support.html">Support</a>
        <a href="/">Login</a>
      </nav>`;

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
${guideNavigation}
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
