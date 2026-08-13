import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const domain = 'https://rswallet.vercel.app';
const publicPages = [
  'about-rswallet.html',
  'rswallet-apk.html',
  'rswallet-support.html',
  'rswallet-usdt.html',
  'rswallet-guide.html',
  'how-to-use-rswallet.html',
  'how-to-deposit-rswallet.html',
  'how-to-deposit-usdt-rswallet.html',
  'rswallet-password-help.html',
];

const failures = [];

const targetQueries = {
  'about-rswallet.html': ['RsWallet', 'Rswallet', 'Rswallet', 'RsWallet login'],
  'rswallet-apk.html': ['RsWallet app', 'RsWallet APK', 'Rswallet app', 'RsWallet login'],
  'rswallet-support.html': ['RsWallet support', 'RsWallet login help', 'RsWallet password'],
  'rswallet-usdt.html': ['RsWallet USDT', 'RsWallet USDT deposit', 'RsWallet USDT withdrawal'],
  'rswallet-guide.html': ['RsWallet', 'Rswallet', 'Rswallet', 'RsWallet login', 'RsWallet app', 'RsWallet APK', 'RsWallet USDT', 'RsWallet password'],
  'how-to-use-rswallet.html': ['How to use RsWallet', 'RsWallet login', 'RsWallet app'],
  'how-to-deposit-rswallet.html': ['How to deposit in RsWallet', 'RsWallet deposit', 'RsWallet login'],
  'how-to-deposit-usdt-rswallet.html': ['How to deposit USDT in RsWallet', 'RsWallet USDT deposit', 'RsWallet USDT'],
  'rswallet-password-help.html': ['RsWallet password', 'RsWallet password reset', 'RsWallet login help'],
};

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function headValue(html, tag, attribute, value, outputAttribute) {
  const tags = html.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) ?? [];
  for (const candidate of tags) {
    const selector = candidate.match(
      new RegExp(`\\b${attribute}\\s*=\\s*["']([^"']+)["']`, 'i'),
    );
    if (selector?.[1]?.toLowerCase() !== value.toLowerCase()) continue;
    const output = candidate.match(
      new RegExp(`\\b${outputAttribute}\\s*=\\s*["']([^"']*)["']`, 'i'),
    );
    return output?.[1] ?? '';
  }
  return '';
}

function validateJsonLd(html, label) {
  const scripts = [
    ...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  expect(scripts.length > 0, `${label}: missing JSON-LD`);
  for (const script of scripts) {
    try {
      JSON.parse(script[1]);
    } catch (error) {
      failures.push(`${label}: invalid JSON-LD (${error.message})`);
    }
  }
}

const login = read('user-app/pages/login.html');
expect(login.includes('<h1 class="header">Login</h1>'), 'login: missing visible H1');
expect(
  headValue(login, 'link', 'rel', 'canonical', 'href') === `${domain}/`,
  'login: canonical must be the root URL',
);
expect(
  headValue(login, 'meta', 'name', 'description', 'content').length >= 70,
  'login: description is missing or too short',
);
expect(!login.includes('/assets/rswallet-og-image.jpg'), 'login: references missing OG image');
expect(!login.includes('/assets/logo.png'), 'login: references missing logo');
validateJsonLd(login, 'login');

const home = read('user-app/pages/home.html');
expect(
  /name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(home),
  'home: authenticated dashboard must be noindex',
);
expect(
  headValue(home, 'link', 'rel', 'canonical', 'href') === `${domain}/home`,
  'home: canonical must use the clean /home route',
);

for (const filename of publicPages) {
  const html = read(`public/${filename}`);
  const label = `public/${filename}`;
  expect(/<meta\b[^>]*name=["']viewport["']/i.test(html), `${label}: missing viewport`);
  expect(
    headValue(html, 'meta', 'name', 'description', 'content').length >= 70,
    `${label}: missing or short description`,
  );
  expect(
    headValue(html, 'link', 'rel', 'canonical', 'href') === `${domain}/${filename}`,
    `${label}: canonical mismatch`,
  );
  expect(/<h1\b[^>]*>[^<]+<\/h1>/i.test(html), `${label}: missing H1`);
  expect((html.match(/<h1\b/gi) ?? []).length === 1, `${label}: must contain exactly one H1`);
  expect(
    /class="[^"]*hero-login[^"]*" href="\/">RsWallet Login<\/a>/.test(html),
    `${label}: missing prominent RsWallet Login link`,
  );
  expect(html.includes('alt="RsWallet logo'), `${label}: missing RsWallet logo alt text`);
  expect(
    html.includes('href="https://rswallet.vercel.app/regist?code=2invite5p6">Register Now</a>'),
    `${label}: missing Register Now CTA`,
  );
  expect(
    html.includes('href="https://t.me/rswalletofficial00"'),
    `${label}: missing Telegram CTA`,
  );
  for (const relatedPage of publicPages) {
    expect(
      html.includes(`href="/${relatedPage}"`),
      `${label}: missing internal link to ${relatedPage}`,
    );
  }
  for (const query of targetQueries[filename]) {
    expect(
      html.toLowerCase().includes(query.toLowerCase()),
      `${label}: missing mapped search topic ${query}`,
    );
  }
  expect(html.includes('Search topics covered'), `${label}: missing visible topic mapping`);
  validateJsonLd(html, label);
}

const usdtGuide = read('public/rswallet-usdt.html');
for (const calculatorId of ['usdtAmount', 'usdtRange', 'inrRate', 'inrOutput', 'rateBadge']) {
  expect(usdtGuide.includes(`id="${calculatorId}"`), `USDT calculator: missing ${calculatorId}`);
}
expect(
  usdtGuide.includes("new Intl.NumberFormat('en-IN'"),
  'USDT calculator: missing INR number formatting',
);

expect(fs.statSync(path.join(root, 'public', 'rswallet-logo.png')).size > 0, 'public logo is empty');

const sitemap = read('public/sitemap.xml');
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedLocations = [`${domain}/`, ...publicPages.map((page) => `${domain}/${page}`)];
expect(
  JSON.stringify(sitemapLocations) === JSON.stringify(expectedLocations),
  `sitemap URLs mismatch: ${sitemapLocations.join(', ')}`,
);
expect(!sitemap.includes('/user-app/'), 'sitemap: internal app URL must not be submitted');
expect(
  read('public/rswallet-guide.html').includes('alternateName'),
  'guide hub: missing RsWallet alternate-name entity signal',
);
for (const filename of publicPages) {
  const html = read(`public/${filename}`);
  expect(html.includes('href="/rswallet-guide.html"'), `${filename}: missing guide hub link`);
}

const robots = read('public/robots.txt');
expect(robots.includes(`Sitemap: ${domain}/sitemap.xml`), 'robots: sitemap directive missing');
expect(robots.includes('Disallow: /admin'), 'robots: admin disallow missing');

if (failures.length) {
  console.error(`SEO audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO audit passed: ${expectedLocations.length} indexable URLs validated.`);
