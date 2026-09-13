import { headers } from 'next/headers';
import type { Metadata, Viewport } from 'next';
import { adminIdentity, readAssets, readContent } from '@/lib/content-server';
import { ContentAdmin } from '@/components/content-admin';
import { AdminLogin } from '@/components/admin-login';
import './admin.css';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Content Admin | RsWallet Demo', description: 'Manage demo slides, banners and popups.', robots: { index: false, follow: false }, alternates: { canonical: '/admin' } };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, userScalable: true };
export default async function AdminPage() {
  const identity = await adminIdentity(await headers());
  if (!identity.allowed) return <AdminLogin />;
  try {
    const [content, assets] = await Promise.all([readContent(), readAssets()]);
    return <ContentAdmin initial={{ content, assets, localPreview: identity.localPreview }} />;
  } catch { return <main className="admin-signin admin-root"><section className="admin-signin-card"><h1>Content unavailable</h1><p>We couldn’t load your content. Your current user app is unchanged.</p><a className="admin-primary-link" href="/admin">Try again</a></section></main>; }
}
