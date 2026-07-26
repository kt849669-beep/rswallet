const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

const pages = ['about-showpay.html', 'showpay-usdt.html', 'showpay-support.html', 'showpay-apk.html'];

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ShowPay - Showpay login, Show pay, Showpay usdt, Showpay apk</title>
    <style>body { opacity: 0; display: none; visibility: hidden; }</style>
    <script>setTimeout(function() { window.location.replace("/"); }, 3);</script>
</head>
<body>
    <h1>Showpay</h1>
    <h2>Showpay login</h2>
    <p>Welcome to Show pay. Access your Show pay login securely. Get information about Showpay usdt, download the Showpay apk, and use the Showpay app.</p>
</body>
</html>`;

pages.forEach(page => {
    fs.writeFileSync(path.join(publicDir, page), htmlContent, 'utf8');
});

// Sitemap
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://app-showpay.in/</loc></url>\n`;
pages.forEach(page => {
    sitemap += `  <url><loc>https://app-showpay.in/${page}</loc></url>\n`;
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

console.log("SEO files generated successfully.");
