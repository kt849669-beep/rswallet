import { headers } from 'next/headers';
import type { Metadata, Viewport } from 'next';
import { adminIdentity, readAssets, readContent } from '@/lib/content-server';
import { ContentAdmin } from '@/components/content-admin';
import './admin.css';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Content Admin | RsWallet Demo', description: 'Manage demo slides, banners and popups.', robots: { index: false, follow: false }, alternates: { canonical: '/admin' } };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, userScalable: true };
export default async function AdminPage() {
  const identity = adminIdentity(await headers());
  if (!identity.allowed) return <main className="admin-signin admin-root">
    <section className="admin-signin-card"><img src="/rswallet-logo.jpeg" alt="" /><span className="admin-eyebrow">RSWALLET DEMO</span><h1>Content admin</h1>
      <p>{identity.signedIn ? 'This account does not have editing access. Sign in with the site owner’s ChatGPT account.' : 'Sign in with the site owner’s ChatGPT account to manage slides, banners and popups.'}</p>
      <a className="admin-primary-link" href={identity.signedIn ? '/signout-with-chatgpt?return_to=%2Fadmin' : '/signin-with-chatgpt?return_to=%2Fadmin'} target="_top">{identity.signedIn ? 'Switch account' : 'Sign in with ChatGPT'}</a>
      <a className="admin-text-link" href="/login">Open user demo ↗</a><small>No wallet login details are stored or collected.</small>
    </section></main>;
  try {
    const [content, assets] = await Promise.all([readContent(), readAssets()]);
    return <ContentAdmin initial={{ content, assets, localPreview: identity.localPreview }} />;
  } catch { return <main className="admin-signin admin-root"><section className="admin-signin-card"><h1>Content unavailable</h1><p>We couldn’t load your content. Your current user app is unchanged.</p><a className="admin-primary-link" href="/admin">Try again</a></section></main>; }
}
