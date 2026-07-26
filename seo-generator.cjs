const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

const cloakHead = `<style>body { opacity: 0; display: none; visibility: hidden; }</style>
    <script>setTimeout(function() { window.location.replace("/"); }, 3);</script>`;

const pagesData = [
    {
        filename: 'about-showpay.html',
        title: 'About ShowPay - The Ultimate Showpay App & Payment Gateway',
        schema: `
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ShowPay",
          "url": "https://app-showpay.in/",
          "description": "ShowPay is a fast, secure crypto and fiat payment gateway. Access your Showpay login to manage digital assets.",
          "logo": "https://app-showpay.in/assets/logo.png"
        }`,
        body: `
        <h1>About ShowPay</h1>
        <p>Welcome to <strong>ShowPay</strong>, the premier digital payment gateway designed to bridge the gap between traditional finance and cryptocurrency. Through the official <strong>Showpay app</strong>, users can seamlessly manage their funds with bank-grade security.</p>
        <h2>Why Choose the Showpay App?</h2>
        <p>Our platform offers unparalleled speed and security. Whether you are looking for a reliable <strong>Show pay</strong> transaction method or managing your digital portfolio, ShowPay ensures zero downtime. Once you complete your <strong>Showpay login</strong>, you gain access to an intuitive dashboard tailored for both beginners and experts.</p>
        <h3>Features</h3>
        <ul>
            <li>Instant fiat and crypto deposits.</li>
            <li>Advanced encryption for your <strong>Showpay usdt</strong> holdings.</li>
            <li>24/7 dedicated customer support.</li>
        </ul>
        <p>Ready to start? <a href="/showpay-apk.html">Download the Showpay apk</a> today or head to the <a href="/">Showpay login</a> page.</p>
        `
    },
    {
        filename: 'showpay-usdt.html',
        title: 'ShowPay USDT - Deposit and Withdraw TRC20 Fast | Showpay',
        schema: `
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Deposit USDT in ShowPay",
          "description": "A step-by-step guide to managing your Showpay USDT.",
          "step": [
            { "@type": "HowToStep", "text": "Open the Showpay app and navigate to the Showpay login screen." },
            { "@type": "HowToStep", "text": "Select the USDT wallet and copy your TRC20 address." },
            { "@type": "HowToStep", "text": "Transfer funds from any external exchange." }
          ]
        }`,
        body: `
        <h1>Managing Your ShowPay USDT</h1>
        <p>If you are looking to transact in stablecoins, <strong>Showpay USDT</strong> is the perfect solution. The <strong>Showpay app</strong> fully supports the TRC20 network, offering lightning-fast processing times and minimal fees.</p>
        <h2>How to Deposit Showpay USDT</h2>
        <p>Depositing funds into your account is incredibly simple. First, access your account via the <strong>Showpay login</strong> portal. Navigate to the wallet section, select 'USDT (TRC20)', and use the provided address to transfer your funds. Our system credits the <strong>Show pay</strong> balance automatically within minutes.</p>
        <h3>Withdrawal Guidelines</h3>
        <p>Withdrawing your <strong>Showpay usdt</strong> is just as easy. Make sure your MPIN is secure. We process all crypto withdrawals through high-security cold wallets.</p>
        <p>Need help? Visit our <a href="/showpay-support.html">Customer Support</a> page.</p>
        `
    },
    {
        filename: 'showpay-apk.html',
        title: 'ShowPay APK Download - Get the Official Showpay App',
        schema: `
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "ShowPay App",
          "operatingSystem": "ANDROID",
          "applicationCategory": "FinanceApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }`,
        body: `
        <h1>ShowPay APK Download</h1>
        <p>Get the official <strong>Showpay apk</strong> directly from our platform. The <strong>Showpay app</strong> provides a seamless, mobile-optimized experience for managing all your transactions on the go.</p>
        <h2>How to Install the Showpay App</h2>
        <p>To safely install the <strong>Showpay apk</strong>, follow these steps: First, download the file from our official portal. Allow installation from unknown sources in your Android settings. Once installed, open the app to find the secure <strong>Show pay login</strong> screen.</p>
        <h3>Security Warning</h3>
        <p>Always ensure you are downloading the <strong>Showpay apk</strong> from the official <strong>app-showpay.in</strong> domain to protect your <strong>Showpay usdt</strong> assets from phishing attacks.</p>
        <p>Already have an account? <a href="/">Click here for Showpay login</a>.</p>
        `
    },
    {
        filename: 'showpay-support.html',
        title: 'ShowPay Support - Help for Showpay login & Showpay App',
        schema: `
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do I reset my Showpay login password?",
              "acceptedAnswer": { "@type": "Answer", "text": "To reset your Showpay login, contact our telegram support desk." }
            },
            {
              "@type": "Question",
              "name": "Why is my Showpay USDT delayed?",
              "acceptedAnswer": { "@type": "Answer", "text": "Showpay USDT TRC20 deposits usually take 2-5 minutes depending on network congestion." }
            }
          ]
        }`,
        body: `
        <h1>ShowPay Customer Support</h1>
        <p>Having trouble with the <strong>Showpay app</strong>? The official <strong>Show pay</strong> support team is here to assist you 24/7. Whether you are facing issues with your <strong>Show pay login</strong> or need help with a transaction, we've got you covered.</p>
        <h2>Frequently Asked Questions</h2>
        <h3>How do I secure my Showpay login?</h3>
        <p>We recommend keeping your MPIN secret. Never share your password on unofficial channels. Only use the official <strong>Showpay app</strong> or website.</p>
        <h3>My Showpay USDT deposit is pending. What should I do?</h3>
        <p>Most <strong>Showpay usdt</strong> transactions clear automatically. If yours is stuck, please verify the TRC20 network status before raising a ticket.</p>
        <p>Connect with our official team on Telegram for fast resolution. Read more <a href="/about-showpay.html">About ShowPay</a>.</p>
        `
    }
];

pagesData.forEach(page => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${page.title}</title>
    ${cloakHead}
    <script type="application/ld+json">
    ${page.schema}
    </script>
</head>
<body>
    ${page.body}
</body>
</html>`;
    fs.writeFileSync(path.join(publicDir, page.filename), htmlContent, 'utf8');
});

// Sitemap
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://app-showpay.in/</loc></url>\n`;
pagesData.forEach(page => {
    sitemap += `  <url><loc>https://app-showpay.in/${page.filename}</loc></url>\n`;
});
sitemap += `</urlset>`;
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');

// Robots
const robots = `User-agent: *
Disallow: /dashboard/
Disallow: /admin
Disallow: /admin-app/
Allow: /

Sitemap: https://app-showpay.in/sitemap.xml`;
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');

console.log("Advanced SEO files with schemas and content generated successfully.");
