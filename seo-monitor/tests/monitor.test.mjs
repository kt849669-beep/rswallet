import test from 'node:test';
import assert from 'node:assert/strict';
import {
  completedPeriods,
  inspectHtml,
  inspectRobots,
  normalizeQuery,
  parseSitemap,
  percentChange,
} from '../lib.mjs';

test('uses complete seven-day comparison windows', () => {
  assert.deepEqual(completedPeriods(new Date('2026-08-04T12:00:00Z')), {
    current: { start: '2026-07-27', end: '2026-08-02' },
    previous: { start: '2026-07-20', end: '2026-07-26' },
  });
});

test('normalizes keyword casing and spaces', () => {
  assert.equal(normalizeQuery('  RsWallet   Login '), 'rswallet login');
});

test('calculates percentage changes safely', () => {
  assert.equal(percentChange(7, 10), -30);
  assert.equal(percentChange(0, 0), 0);
  assert.equal(percentChange(1, 0), null);
});

test('extracts essential SEO fields and internal links', () => {
  const html = `<!doctype html><html><head>
    <title>RsWallet Login</title>
    <meta name="description" content="A sufficiently descriptive and truthful description for the monitored RsWallet page.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="https://rswallet.vercel.app/">
    <script type="application/ld+json">{"@type":"WebSite"}</script>
  </head><body><h1>RsWallet Login</h1><a href="/support.html">Support</a></body></html>`;
  const result = inspectHtml(html, 'https://rswallet.vercel.app/');
  assert.equal(result.title, 'RsWallet Login');
  assert.equal(result.canonical, 'https://rswallet.vercel.app/');
  assert.deepEqual(result.h1s, ['RsWallet Login']);
  assert.deepEqual(result.links, ['https://rswallet.vercel.app/support.html']);
  assert.deepEqual(result.schemaErrors, []);
});

test('parses sitemap and robots directives', () => {
  assert.deepEqual(parseSitemap('<urlset><url><loc>https://rswallet.vercel.app/</loc></url></urlset>'), ['https://rswallet.vercel.app/']);
  assert.deepEqual(inspectRobots('User-agent: *\nAllow: /\nSitemap: https://rswallet.vercel.app/sitemap.xml', 'https://rswallet.vercel.app/'), {
    sitemaps: ['https://rswallet.vercel.app/sitemap.xml'],
    declaresExpectedSitemap: true,
    blocksAll: false,
  });
});
