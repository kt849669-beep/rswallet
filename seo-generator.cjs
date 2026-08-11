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
      'Learn what ShowPay is, where to access the official web login, how the mobile app experience works and where to find account and payment guides.',
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
      'Find safe ShowPay app and APK access information, use the verified web login and learn why unverified download files can put account details at risk.',
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
      'Get ShowPay login, app and account help with password recovery guidance, safe access checks, USDT transaction tips and links to task-specific guides.',
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
      'Use the ShowPay USDT guide to check the selected network, full wallet address, confirmations and account status before a deposit or withdrawal.',
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
      'Browse practical ShowPay guides for login and app access, account deposits, USDT network checks, password recovery and common support questions.',
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
      'Learn how to use ShowPay safely: verify the login URL, sign in to your own account, review available dashboard tools and find the right help guide.',
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
      'Follow safe ShowPay deposit checks: sign in, use the option shown in your account, verify payment details and review the transaction status.',
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
      'Learn how to check a ShowPay USDT deposit by matching the network, verifying the complete wallet address and reviewing blockchain confirmations.',
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
      'Use safe ShowPay password recovery guidance, open the reset option from the main login page and protect your password, OTP and MPIN during recovery.',
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

const pageEnhancements = {
  'about-showpay.html': {
    queries: ['ShowPay', 'Showpay', 'Show pay', 'ShowPay login'],
    summary: 'ShowPay is a mobile-friendly web account experience. Use this site for the ShowPay login and review only the tools and instructions displayed inside your own account.',
    audience: 'New or returning users who want to confirm what ShowPay is, where to sign in and which help pages match their task.',
    keyPoints: [
      'The primary account entry point is https://app-showpay.in/.',
      'ShowPay, Showpay and Show pay are treated as spelling variants of the same topic on this site.',
      'Account features can differ, so the signed-in dashboard is the current source for available options.',
    ],
    questions: [
      ['Is ShowPay a mobile app or a website?', 'The account experience on this domain is a responsive web app that works in a mobile browser.'],
      ['Where should I start?', 'Open the main ShowPay login, confirm the domain and use the help guide that matches your task.'],
    ],
  },
  'showpay-apk.html': {
    queries: ['ShowPay app', 'ShowPay APK', 'Show pay app', 'ShowPay login'],
    summary: 'Use the ShowPay mobile web login on app-showpay.in. This site does not publish a direct APK file, so avoid downloads from unverified pages, messages or social posts.',
    audience: 'People searching for ShowPay app access, ShowPay APK information or the correct mobile login.',
    keyPoints: [
      'The browser-based ShowPay app does not require an APK from this page.',
      'Verify the complete domain before entering a phone number or password.',
      'Unknown APK files can request unnecessary permissions or expose account information.',
    ],
    questions: [
      ['Can I download a ShowPay APK here?', 'No. This page provides safe access guidance and links to the mobile-friendly web login.'],
      ['How do I use ShowPay on Android?', 'Open app-showpay.in in a current mobile browser and sign in through the displayed login form.'],
    ],
  },
  'showpay-support.html': {
    queries: ['ShowPay support', 'ShowPay login help', 'ShowPay password'],
    summary: 'Start with the exact problem shown on your screen, use the existing recovery option for login issues and verify transaction details inside your own dashboard.',
    audience: 'Users who need login, password, app-access, deposit or USDT transaction guidance.',
    keyPoints: [
      'Never share a password, OTP or MPIN with an unknown support contact.',
      'For transaction questions, record the network, amount, time and transaction reference shown in the account.',
      'Avoid repeated payments or recovery attempts until the previous status is understood.',
    ],
    questions: [
      ['What information should I check before asking for help?', 'Check the exact error, transaction status, network and time while keeping private credentials secret.'],
      ['Does this page ask for my password?', 'No. The public support guide does not collect account credentials.'],
    ],
  },
  'showpay-usdt.html': {
    queries: ['ShowPay USDT', 'ShowPay USDT deposit', 'ShowPay USDT withdrawal'],
    summary: 'For ShowPay USDT actions, match the network, verify the complete wallet address and wait for the required confirmations before attempting another transfer.',
    audience: 'Users researching ShowPay USDT deposits, withdrawals, network selection or transaction-status checks.',
    keyPoints: [
      'The sending and receiving USDT networks must match exactly.',
      'Compare the full destination address, not only its first and last characters.',
      'Network confirmation time is separate from the account status shown in ShowPay.',
    ],
    questions: [
      ['Why is a ShowPay USDT transaction pending?', 'Network activity, confirmation requirements or account review can affect status; check both the blockchain reference and dashboard.'],
      ['Should I send a second transaction?', 'Do not repeat a transfer until the first transaction reference and current account status have been verified.'],
    ],
  },
  'showpay-guide.html': {
    queries: ['ShowPay', 'Showpay', 'Show pay', 'ShowPay login', 'ShowPay app', 'ShowPay APK', 'ShowPay USDT', 'ShowPay password'],
    summary: 'Choose one task-focused ShowPay guide: login and password help, mobile app access, general deposits or USDT network checks.',
    audience: 'Anyone who wants a single directory for the available ShowPay help and account-access pages.',
    keyPoints: [
      'Use the login guide for access and recovery questions.',
      'Use the app/APK guide to identify the browser-based mobile experience.',
      'Use the USDT guides before selecting a network or confirming an address.',
    ],
    questions: [
      ['Which ShowPay guide should I read first?', 'Start with the guide matching your immediate task; the login page remains the account entry point.'],
      ['Are these pages part of the login workflow?', 'They are public supporting guides and do not change the existing login or dashboard workflow.'],
    ],
  },
  'how-to-use-showpay.html': {
    queries: ['How to use ShowPay', 'ShowPay login', 'ShowPay app'],
    summary: 'Open the correct ShowPay login, sign in with your own account details and follow the current labels and instructions displayed in the dashboard.',
    audience: 'First-time users who need a simple orientation to ShowPay login, navigation and account help.',
    keyPoints: [
      'Confirm app-showpay.in before entering account details.',
      'Use only features that are currently visible and enabled in your dashboard.',
      'Use password recovery from the login screen when account access fails.',
    ],
    questions: [
      ['What do I need to use ShowPay?', 'Use the phone number and password associated with your own account on the main login page.'],
      ['Why can my dashboard look different?', 'Available tools and labels can vary by account or current platform configuration.'],
    ],
  },
  'how-to-deposit-showpay.html': {
    queries: ['How to deposit in ShowPay', 'ShowPay deposit', 'ShowPay login'],
    summary: 'Use a deposit option only when it is visible in your signed-in ShowPay account, then verify the method, amount and recipient details before confirming.',
    audience: 'Users who want a general checklist before using an available ShowPay deposit option.',
    keyPoints: [
      'Read the current instructions inside the account rather than an old screenshot.',
      'Verify the amount, recipient and payment reference before taking action.',
      'Check the first transaction status before attempting another payment.',
    ],
    questions: [
      ['Why can deposit instructions change?', 'Availability and displayed payment details can vary, so use the current signed-in screen as the source.'],
      ['Where can I find USDT-specific checks?', 'Use the dedicated ShowPay USDT deposit and network guide before a crypto transfer.'],
    ],
  },
  'how-to-deposit-usdt-showpay.html': {
    queries: ['How to deposit USDT in ShowPay', 'ShowPay USDT deposit', 'ShowPay USDT'],
    summary: 'Before a ShowPay USDT deposit, match the supported network, verify the complete address and retain the transaction reference until the account status updates.',
    audience: 'Users preparing a USDT deposit through an option displayed in their ShowPay account.',
    keyPoints: [
      'Network mismatch can cause permanent loss, so compare network names carefully.',
      'Verify the current address shown in the signed-in account for every deposit.',
      'Wait for confirmations and status updates before retrying a transfer.',
    ],
    questions: [
      ['Can I reuse an old ShowPay deposit address?', 'Use only the current address and network displayed in your own account at the time of the deposit.'],
      ['What should I save after sending USDT?', 'Retain the transaction hash, selected network, amount and time without sharing private wallet credentials.'],
    ],
  },
  'showpay-password-help.html': {
    queries: ['ShowPay password', 'ShowPay password reset', 'ShowPay login help'],
    summary: 'Open password recovery from the main ShowPay login, follow the displayed recovery flow and never share a password, OTP or MPIN with another person.',
    audience: 'Users who forgot a ShowPay password, cannot sign in or want safer account-recovery guidance.',
    keyPoints: [
      'Start recovery from the Forget Password link on the main login screen.',
      'Keep passwords, OTPs and MPINs private during every support interaction.',
      'After recovery, return to app-showpay.in and sign in again.',
    ],
    questions: [
      ['Can support ask for my current password?', 'No. Do not send your current password, OTP or MPIN to another person.'],
      ['What if recovery does not complete?', 'Stop repeated attempts, verify the exact error and use the public support guidance for the next safe step.'],
    ],
  },
};

function enhancementHtml(page) {
  const item = pageEnhancements[page.filename];
  if (!item) return '';
  return `
      <section class="answer-card" aria-labelledby="quick-answer">
        <p class="eyebrow">Quick answer</p>
        <h2 id="quick-answer">${page.body.match(/<h1>(.*?)<\/h1>/)?.[1] || page.title}</h2>
        <p>${item.summary}</p>
      </section>
      <section>
        <h2>Who is this guide for?</h2>
        <p>${item.audience}</p>
        <div class="topic-box" aria-labelledby="topics-covered">
          <h2 id="topics-covered">Search topics covered</h2>
          <p>This guide directly covers these related ShowPay searches:</p>
          <ul class="topic-list">${item.queries.map((query) => `<li>${query}</li>`).join('')}</ul>
        </div>
        <h2>Key checks</h2>
        <ul>${item.keyPoints.map((point) => `<li>${point}</li>`).join('')}</ul>
      </section>
      <section class="faq" aria-labelledby="common-questions">
        <h2 id="common-questions">Common questions</h2>
        ${item.questions.map(([question, answer]) => `<h3>${question}</h3><p>${answer}</p>`).join('')}
      </section>`;
}

const styles = `
      :root { color-scheme: light; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; --navy: #1f2d7a; --blue: #2563eb; --red: #f43f4f; --ink: #111827; --muted: #64748b; --line: #e5e7eb; --wash: #f6f8fc; --sky: #ecf9ff; }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; background: #fff; color: #334155; line-height: 1.7; }
      a { color: var(--blue); text-underline-offset: 3px; }
      h1, h2, h3 { color: var(--ink); line-height: 1.18; letter-spacing: -.025em; }
      h1 { margin: .45rem 0 0; font-size: clamp(2rem, 7vw, 3.9rem); }
      h2 { margin: 2rem 0 .7rem; font-size: clamp(1.45rem, 4vw, 2rem); }
      h3 { margin: 1.25rem 0 .35rem; }
      p { margin: .65rem 0; }
      .site-header { position: sticky; top: 0; z-index: 10; border-bottom: 1px solid rgba(226,232,240,.9); background: rgba(255,255,255,.94); backdrop-filter: blur(14px); }
      .header-inner { width: min(1180px, calc(100% - 32px)); min-height: 76px; margin: auto; display: flex; align-items: center; justify-content: space-between; gap: 18px; }
      .brand { display: inline-flex; align-items: center; gap: 10px; color: var(--navy); font-weight: 800; text-decoration: none; font-size: 1.12rem; }
      .brand-mark { width: 38px; height: 38px; display: block; border-radius: 11px; object-fit: contain; background: var(--navy); box-shadow: 0 8px 20px rgba(31,45,122,.22); }
      .header-nav { display: flex; align-items: center; justify-content: center; gap: 17px; }
      .header-nav a { color: #475569; font-size: .9rem; text-decoration: none; white-space: nowrap; }
      .header-actions { display: flex; align-items: center; gap: 10px; }
      .button { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; padding: 10px 18px; border: 1px solid var(--line); border-radius: 999px; font-weight: 780; text-decoration: none; white-space: nowrap; }
      .register-link { color: #fff; border-color: var(--red); background: var(--red); box-shadow: 0 10px 22px rgba(244,63,79,.2); }
      .login-link, .hero-login { color: #fff; border-color: var(--blue); background: var(--blue); box-shadow: 0 10px 22px rgba(37,99,235,.24); }
      main { width: min(1120px, calc(100% - 32px)); margin: 0 auto; }
      .hero { margin: 28px 0; padding: clamp(26px, 6vw, 64px); border: 1px solid #dbeafe; border-radius: 30px; background: radial-gradient(circle at 92% 12%, #dff7ff 0, transparent 34%), linear-gradient(135deg, #fff 0%, #f7f5ff 48%, #eefbff 100%); box-shadow: 0 24px 60px rgba(30,41,59,.08); }
      .hero-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(300px, .75fr); align-items: center; gap: clamp(28px, 6vw, 72px); }
      .breadcrumb { color: var(--muted); font-size: .9rem; }
      .breadcrumb a { color: var(--navy); font-weight: 700; text-decoration: none; }
      .title-row { margin-top: 18px; }
      .title-copy { max-width: 720px; }
      .eyebrow { margin: 0; color: var(--navy); font-size: .78rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
      .rate-pill { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border: 1px solid #dbeafe; border-radius: 999px; background: rgba(255,255,255,.84); color: #475569; font-size: .84rem; }
      .rate-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red); }
      .hero-description { max-width: 690px; margin-top: 18px; color: #526174; font-size: 1.08rem; }
      .hero-actions { display: flex; flex-wrap: wrap; gap: 11px; margin-top: 24px; }
      .telegram-link { color: var(--navy); background: #fff; }
      .trust-chips { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 20px; }
      .trust-chip { padding: 7px 11px; border: 1px solid #dbe3ee; border-radius: 999px; background: rgba(255,255,255,.82); color: #334155; font-size: .8rem; font-weight: 650; }
      .hero-logo-card { min-height: 320px; display: grid; place-items: center; padding: 30px; border: 1px solid rgba(219,234,254,.95); border-radius: 28px; background: rgba(255,255,255,.88); box-shadow: 0 22px 52px rgba(31,45,122,.12); text-align: center; }
      .hero-logo-card img { width: min(190px, 70%); height: auto; aspect-ratio: 1; object-fit: contain; filter: drop-shadow(0 18px 26px rgba(31,45,122,.18)); }
      .hero-logo-card strong { display: block; margin-top: 15px; color: var(--navy); font-size: 1.2rem; }
      .hero-logo-card span { color: var(--muted); font-size: .88rem; }
      .content-grid { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(260px, .75fr); gap: 24px; align-items: start; }
      .content-panel, .answer-card, .faq, .side-card, .calculator-card { border: 1px solid var(--line); border-radius: 22px; background: #fff; box-shadow: 0 14px 40px rgba(15,23,42,.055); }
      .content-panel { padding: clamp(22px, 4vw, 40px); }
      .content-panel > p:first-child { margin-top: 0; font-size: 1.08rem; color: #475569; }
      .content-panel ul, .content-panel ol { padding-left: 1.35rem; }
      .content-panel li + li { margin-top: .6rem; }
      .content-panel li::marker { color: var(--red); font-weight: 800; }
      .notice { margin-top: 1.5rem; padding: 15px 17px; border-left: 4px solid var(--blue); border-radius: 0 14px 14px 0; background: #eff6ff; }
      .side-stack { display: grid; gap: 18px; }
      .side-card { padding: 22px; background: linear-gradient(145deg, #f8fbff, #fff); }
      .side-card h2 { margin-top: 0; font-size: 1.25rem; }
      .side-card a { display: block; padding: 9px 0; border-bottom: 1px solid #edf2f7; font-weight: 650; text-decoration: none; }
      .side-card a:last-child { border-bottom: 0; }
      .answer-card, .faq { margin: 24px 0; padding: clamp(22px, 4vw, 36px); }
      .answer-card { border-color: #c7e8ff; background: linear-gradient(135deg, #eef9ff, #fff); }
      .answer-card h2 { margin: .25rem 0 .6rem; }
      .faq h3 { padding: 18px 20px 8px; margin: 14px 0 0; border: 1px solid var(--line); border-bottom: 0; border-radius: 15px 15px 0 0; background: #fff; }
      .faq h3 + p { margin: 0; padding: 0 20px 18px; border: 1px solid var(--line); border-top: 0; border-radius: 0 0 15px 15px; color: #526174; }
      .topic-box { margin: 24px 0; padding: 20px; border: 1px solid #dbeafe; border-radius: 18px; background: #f8fbff; }
      .topic-box h2 { margin-top: 0; }
      .topic-list { display: flex; flex-wrap: wrap; gap: 9px; margin: 14px 0 0; padding: 0 !important; list-style: none; }
      .topic-list li { margin: 0 !important; padding: 7px 11px; border: 1px solid #cbdcf5; border-radius: 999px; background: #fff; color: var(--navy); font-size: .88rem; font-weight: 700; }
      .guide-nav { margin: 28px 0; padding: clamp(22px, 4vw, 34px); border-radius: 24px; background: var(--wash); }
      .guide-nav h2 { margin-top: 0; }
      .link-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
      .link-grid a { min-height: 70px; display: flex; align-items: center; padding: 14px 16px; border: 1px solid var(--line); border-radius: 14px; background: #fff; color: var(--navy); font-weight: 750; text-decoration: none; }
      .calculator-card { margin: 0 0 28px; padding: clamp(22px, 4vw, 34px); }
      .calc-head { display: flex; justify-content: space-between; align-items: center; gap: 18px; }
      .calc-head h2 { margin: 0; }
      .rate-badge { padding: 7px 12px; border-radius: 999px; color: #b42331; background: #fff0f2; font-weight: 800; }
      .calc-boxes { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: center; margin-top: 20px; }
      .calc-box { padding: 18px; border-radius: 18px; background: #f6f8fb; }
      .calc-box label { display: block; color: var(--muted); font-size: .84rem; }
      .calc-box input { width: 100%; margin-top: 5px; border: 0; outline: 0; background: transparent; color: var(--ink); font-family: inherit; font-size: 1.7rem; font-weight: 800; line-height: 1.2; }
      .calc-output { display: block; margin-top: 5px; color: var(--red); font-size: 1.7rem; font-weight: 850; }
      .calc-arrow { width: 42px; height: 42px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 50%; color: var(--navy); }
      .range-row { display: grid; grid-template-columns: 1fr 150px; gap: 16px; margin-top: 18px; }
      .range-row input[type="range"] { accent-color: var(--navy); }
      .rate-field { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid var(--line); border-radius: 12px; }
      .rate-field input { width: 75px; border: 0; outline: 0; font-weight: 800; }
      .calc-note { margin-top: 14px; color: var(--muted); font-size: .86rem; }
      .site-footer { margin-top: 50px; padding: 34px 0; color: #dbeafe; background: var(--navy); }
      .footer-inner { width: min(1120px, calc(100% - 32px)); margin: auto; display: flex; align-items: center; justify-content: space-between; gap: 22px; }
      .site-footer strong { color: #fff; }
      .site-footer a { color: #fff; }
      @media (max-width: 1040px) { .header-nav { display: none; } }
      @media (max-width: 820px) { .hero-grid, .content-grid { grid-template-columns: 1fr; } .hero-logo-card { min-height: 250px; } .link-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      @media (max-width: 560px) { .header-inner { min-height: 66px; } .brand span:last-child { display: none; } .header-actions .register-link { display: none; } .button { padding: 9px 14px; } .hero { margin: 16px 0; border-radius: 22px; } .hero-login, .hero-actions .register-link, .telegram-link { flex: 1 1 100%; } .hero-logo-card { min-height: 220px; } .hero-logo-card img { width: 140px; } .calc-boxes { grid-template-columns: 1fr; } .calc-arrow { margin: -4px auto; transform: rotate(90deg); } .range-row, .link-grid { grid-template-columns: 1fr; } .footer-inner { align-items: flex-start; flex-direction: column; } }
`;

const guideNavigation = `
      <nav class="guide-nav" id="guide-list" aria-label="ShowPay guide navigation">
        <p class="eyebrow">Explore ShowPay</p>
        <h2>Related ShowPay guides</h2>
        <div class="link-grid">
          <a href="/showpay-guide.html">All ShowPay Guides</a>
          <a href="/about-showpay.html">About ShowPay</a>
          <a href="/showpay-apk.html">ShowPay App &amp; APK</a>
          <a href="/showpay-usdt.html">ShowPay USDT</a>
          <a href="/how-to-use-showpay.html">How to Use ShowPay</a>
          <a href="/how-to-deposit-showpay.html">ShowPay Deposit Guide</a>
          <a href="/how-to-deposit-usdt-showpay.html">USDT Deposit Guide</a>
          <a href="/showpay-password-help.html">Password Help</a>
          <a href="/showpay-support.html">ShowPay Support</a>
        </div>
      </nav>`;

function calculatorHtml(page) {
  if (page.filename !== 'showpay-usdt.html') return '';
  return `
      <section class="calculator-card" aria-labelledby="usdt-calculator-title">
        <div class="calc-head">
          <div><p class="eyebrow">USDT estimate</p><h2 id="usdt-calculator-title">USDT to INR Calculator</h2></div>
          <span class="rate-badge" id="rateBadge">₹112 / USDT</span>
        </div>
        <div class="calc-boxes">
          <div class="calc-box"><label for="usdtAmount">You enter (USDT)</label><input id="usdtAmount" type="number" min="1" step="1" value="1000" inputmode="decimal" /></div>
          <span class="calc-arrow" aria-hidden="true">↓</span>
          <div class="calc-box"><span>Estimated INR</span><output class="calc-output" id="inrOutput" for="usdtAmount inrRate">₹1,12,000</output></div>
        </div>
        <div class="range-row">
          <input id="usdtRange" type="range" min="1" max="5000" step="1" value="1000" aria-label="USDT amount" />
          <label class="rate-field" for="inrRate">₹ <input id="inrRate" type="number" min="0.01" step="0.01" value="112" inputmode="decimal" /> rate</label>
        </div>
        <p class="calc-note">यह केवल अनुमान है। Transaction से पहले अपने signed-in ShowPay dashboard में दिख रहे current rate, fees और final amount को verify करें।</p>
      </section>`;
}

const calculatorScript = `
    <script>
      (() => {
        const amount = document.getElementById('usdtAmount');
        if (!amount) return;
        const range = document.getElementById('usdtRange');
        const rate = document.getElementById('inrRate');
        const output = document.getElementById('inrOutput');
        const badge = document.getElementById('rateBadge');
        const formatInr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
        const update = (source) => {
          if (source === range) amount.value = range.value;
          if (source === amount) range.value = Math.min(5000, Math.max(1, Number(amount.value) || 1));
          const total = Math.max(0, Number(amount.value) || 0) * Math.max(0, Number(rate.value) || 0);
          output.value = formatInr.format(total);
          output.textContent = formatInr.format(total);
          badge.textContent = '₹' + (Number(rate.value) || 0).toLocaleString('en-IN') + ' / USDT';
        };
        [amount, range, rate].forEach((control) => control.addEventListener('input', () => update(control)));
        update(amount);
      })();
    </script>`;

for (const page of pages) {
  const canonical = `${domain}/${page.filename}`;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ShowPay Login', item: `${domain}/` },
      { '@type': 'ListItem', position: 2, name: page.title.split('|')[0].trim(), item: canonical },
    ],
  };
  const pageHeading = page.body.match(/<h1>(.*?)<\/h1>/)?.[1] || page.title.split('|')[0].trim();
  const pageBody = page.body.replace(/<h1>.*?<\/h1>/, '').trim();
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (pageEnhancements[page.filename]?.questions || []).map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
  const pageSchema = {
    ...page.schema,
    keywords: (pageEnhancements[page.filename]?.queries || []).join(', '),
  };
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
    <script type="application/ld+json">${JSON.stringify(pageSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
    <style>${styles}</style>
  </head>
  <body>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/showpay-guide.html" aria-label="ShowPay Guides"><img class="brand-mark" src="/showpay-logo.png" width="38" height="38" alt="ShowPay logo" /><span>ShowPay</span></a>
        <nav class="header-nav" aria-label="Primary navigation">
          <a href="/showpay-guide.html">Home</a><a href="/showpay-usdt.html#usdt-calculator-title">Exchange</a><a href="/about-showpay.html">About</a><a href="/showpay-guide.html#guide-list">Blog</a><a href="#common-questions">FAQ</a><a href="/showpay-support.html">Contact</a><a href="/">Login</a>
        </nav>
        <div class="header-actions"><a class="button register-link" href="https://app-web.showpay-web.com/regist?code=2invite5p6">Register Now</a><a class="button login-link" href="/">ShowPay Login</a></div>
      </div>
    </header>
    <main>
      <section class="hero">
        <div class="hero-grid">
          <div>
            <span class="rate-pill"><span class="rate-dot" aria-hidden="true"></span>Displayed rate · 1 USDT = ₹112</span>
            <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/showpay-guide.html">ShowPay Guides</a> / ${page.title.split('|')[0].trim()}</nav>
            <div class="title-row"><div class="title-copy"><p class="eyebrow">ShowPay · USDT to INR</p><h1>${pageHeading}</h1></div></div>
            <p class="hero-description">${page.description}</p>
            <div class="hero-actions"><a class="button register-link" href="https://app-web.showpay-web.com/regist?code=2invite5p6">Register Now</a><a class="button hero-login" href="/">ShowPay Login</a><a class="button telegram-link" href="https://t.me/showpayofficial00" rel="noopener noreferrer">Join Telegram</a></div>
            <div class="trust-chips" aria-label="ShowPay highlights"><span class="trust-chip">Instant Exchange</span><span class="trust-chip">Secure Transactions</span><span class="trust-chip">24/7 Support</span><span class="trust-chip">Risk &amp; Safety Checks</span></div>
          </div>
          <div class="hero-logo-card"><div><img src="/showpay-logo.png" width="190" height="190" alt="ShowPay logo for ${pageHeading}" /><strong>${pageHeading}</strong><span>ShowPay information and account guide</span></div></div>
        </div>
      </section>
${calculatorHtml(page)}
      <div class="content-grid">
        <article class="content-panel">
${pageBody}
        </article>
        <aside class="side-stack" aria-label="ShowPay quick links">
          <section class="side-card"><p class="eyebrow">Quick access</p><h2>ShowPay account help</h2><a href="/">Open ShowPay Login</a><a href="/showpay-password-help.html">Password Help</a><a href="/showpay-support.html">Support Guide</a></section>
          <section class="side-card"><p class="eyebrow">Safety check</p><h2>Before you continue</h2><p>Verify the complete app-showpay.in address and use only the current details displayed inside your own signed-in account.</p></section>
        </aside>
      </div>
${enhancementHtml(page)}
${guideNavigation}
    </main>
    <footer class="site-footer"><div class="footer-inner"><div><strong>ShowPay</strong><br />Mobile-friendly account guides and secure access information.</div><div><a href="/showpay-guide.html">Guides</a> · <a href="/about-showpay.html">About</a> · <a href="/showpay-support.html">Support</a> · <a href="/">Login</a></div></div></footer>
${page.filename === 'showpay-usdt.html' ? calculatorScript : ''}
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
