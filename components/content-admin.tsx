'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, CheckCircle2, ChevronDown, ChevronRight, X, UserRound, ArrowUp, ArrowDown, LogOut, Upload, Trash2, Link, Save, GripVertical, Plus, ImagePlus, ShieldCheck, HelpCircle, Images, Video, Megaphone, Smartphone, LayoutDashboard, Search, Menu, Filter, Info, RotateCcw, Users, FileText, Bell } from 'lucide-react';
import { AdminProfile, AdminReports, AdminUsers, signOutAdmin, LogoutButton } from '@/components/admin-account-panels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { AdminData, ContentSettings, MediaAsset } from '@/lib/site-content';
import { publicContent, validateContent } from '@/lib/site-content';

type Target = 'slide' | 'homeBanner' | 'profileBanner' | 'popup' | 'library';
function editable(content: ContentSettings) {
  return JSON.stringify({ slidesEnabled: content.slidesEnabled, slides: content.slides, homeBanner: content.homeBanner, profileBanner: content.profileBanner, telegram: content.telegram, popup: content.popup });
}
function announce(data: AdminData) {
  if (typeof BroadcastChannel === 'undefined') return;
  const channel = new BroadcastChannel('rswallet-content');
  channel.postMessage({ type: 'content', content: publicContent(data.content, data.assets) });
  channel.close();
}
async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, cache: 'no-store' });
  if (response.status === 401) { window.location.replace('/admin'); throw new Error('Please sign in again.'); }
  const result = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(result.error || 'This action could not be completed.');
  return result;
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="admin-toggle"><span>{checked ? 'Visible' : 'Hidden'}</span><Switch aria-label={label} checked={checked} onCheckedChange={onChange} /></label>;
}
function AssetPreview({ asset, label, fallback }: { asset?: MediaAsset; label: string; fallback?: 'home' | 'profile' | 'slide' }) {
  if (asset?.deletedAt) return <div className="admin-empty-preview"><Trash2 /><span>This file is in Trash</span></div>;
  if (asset) return asset.type.startsWith('video/') ? <video className="admin-media-preview" src={`/api/media/${asset.id}`} controls playsInline preload="metadata" /> : <img className="admin-media-preview" src={`/api/media/${asset.id}`} alt={label} />;
  if (fallback) return <div className={`admin-default-preview default-${fallback}`}><img src={fallback === 'profile' ? '/rswallet-profile.jpeg' : '/rswallet-home.jpeg'} alt={`Original ${label}`} /></div>;
  return <div className="admin-empty-preview"><ImagePlus /><span>Choose an image or video</span></div>;
}
export function ContentAdmin({ initial }: { initial: AdminData }) {
  const [content, setContent] = useState(initial.content);
  const [saved, setSaved] = useState(initial.content);
  const [assets, setAssets] = useState(initial.assets);
  const [tab, setTab] = useState('users');
  const [menuOpen, setMenuOpen] = useState(false);
  const [picker, setPicker] = useState<Target | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [savePaused, setSavePaused] = useState(false);
  const saving = useRef(false);
  const dirty = editable(content) !== editable(saved);
  const syncState = useRef({ dirty, busy, uploading, revision: saved.revision });
  syncState.current = { dirty, busy, uploading, revision: saved.revision };
  const activeAssets = assets.filter(a => !a.deletedAt);
  const trashedAssets = assets.filter(a => a.deletedAt);
  const getAsset = (id: string | null) => assets.find(a => a.id === id);
  const patch = (next: Partial<ContentSettings>) => { setContent(current => ({ ...current, ...next })); setMessage(''); setError(''); setSavePaused(false); };

  const save = useCallback(async () => {
    if (saving.current || editable(content) === editable(saved)) return;
    try { validateContent(content); }
    catch (e) { setError((e as Error).message); setSavePaused(true); return; }
    saving.current = true;
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await api<AdminData>('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) });
      setContent(current => editable(current) === editable(content) ? result.content : { ...current, revision: result.content.revision, updatedAt: result.content.updatedAt, presentationVersions: result.content.presentationVersions });
      setSaved(result.content); setAssets(result.assets); setSavePaused(false);
      setMessage('Saved. Connected user apps update live.'); announce(result);
    } catch (e) { setError((e as Error).message); setSavePaused(true); }
    finally { saving.current = false; setBusy(false); }
  }, [content, saved]);
  useEffect(() => {
    if (!dirty || busy || uploading || savePaused) return;
    const visibilityChanged = content.slidesEnabled !== saved.slidesEnabled
      || content.homeBanner.enabled !== saved.homeBanner.enabled
      || content.profileBanner.enabled !== saved.profileBanner.enabled
      || content.telegram.enabled !== saved.telegram.enabled
      || content.popup.enabled !== saved.popup.enabled
      || content.slides.some((slide, index) => slide.enabled !== saved.slides[index]?.enabled);
    const timer = window.setTimeout(() => { void save(); }, visibilityChanged ? 0 : 450);
    return () => window.clearTimeout(timer);
  }, [dirty, busy, uploading, savePaused, save, content, saved]);
  useEffect(() => {
    const retry = () => setSavePaused(false);
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, []);
  useEffect(() => {
    if (!savePaused || !dirty) return;
    try { validateContent(content); } catch { return; }
    let active = true;
    const retry = async () => {
      try {
        const data = await api<AdminData>('/api/admin/content');
        if (!active) return;
        if (editable(data.content) === editable(content)) {
          setContent(data.content); setSaved(data.content); setAssets(data.assets); setError(''); setSavePaused(false); announce(data);
        } else if (data.content.revision === saved.revision) { setError(''); setSavePaused(false); }
      } catch { /* Keep the draft and retry when the server is reachable. */ }
    };
    const timer = window.setInterval(() => { void retry(); }, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [savePaused, dirty, content, saved.revision]);
  useEffect(() => {
    let active = true;
    let fetching = false;
    const events = new EventSource('/api/content/stream');
    const refresh = async () => {
      if (fetching || syncState.current.dirty || syncState.current.busy || syncState.current.uploading) return;
      fetching = true;
      try {
        const data = await api<AdminData>('/api/admin/content');
        if (active && !syncState.current.dirty && !syncState.current.busy && !syncState.current.uploading && data.content.revision >= syncState.current.revision) { setContent(data.content); setSaved(data.content); setAssets(data.assets); }
      } catch { /* Preserve unsaved work while the network reconnects. */ }
      finally { fetching = false; }
    };
    events.addEventListener('content', refresh);
    return () => { active = false; events.close(); };
  }, []);
  const reload = async () => {
    setBusy(true); setError('');
    try { const result = await api<AdminData>('/api/admin/content'); setContent(result.content); setSaved(result.content); setAssets(result.assets); setSavePaused(false); setMessage('Latest saved content loaded.'); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };
  const chooseAsset = (asset: MediaAsset) => {
    if (picker === 'slide') {
      if (content.slides.some(s => s.assetId === asset.id)) { setError('This image is already in your slides.'); return; }
      if (content.slides.length >= 12) { setError('You can add up to 12 slides.'); return; }
      patch({ slides: [...content.slides, { assetId: asset.id, enabled: true }] });
    } else if (picker && picker !== 'library') patch({ [picker]: { ...content[picker], assetId: asset.id } });
    setPicker(null);
  };
  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true); setError('');
    try { const form = new FormData(); form.append('file', file); const result = await api<{ asset: MediaAsset }>('/api/admin/media', { method: 'POST', body: form }); setAssets(current => [result.asset, ...current]); if (picker !== 'library') chooseAsset(result.asset); setMessage(picker === 'library' ? 'File uploaded to your media library.' : 'File selected. Changes save automatically.'); }
    catch (e) { setError((e as Error).message); } finally { setUploading(false); }
  };
  const trash = async (asset: MediaAsset, deleted: boolean) => {
    setBusy(true); setError('');
    try { await api('/api/admin/media', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: asset.id, deleted }) }); setAssets(current => current.map(a => a.id === asset.id ? { ...a, deletedAt: deleted ? new Date().toISOString() : null } : a)); setMessage(deleted ? 'File moved to Trash and hidden from the app. You can restore it.' : 'File restored. Its saved placements are available again.'); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };
  const moveSlide = (index: number, direction: number) => {
    const slides = [...content.slides]; [slides[index], slides[index + direction]] = [slides[index + direction], slides[index]]; patch({ slides });
  };
  const sectionTitle = (title: string, subtitle: string, action?: ReactNode) => <div className="admin-section-title"><div><h2>{title}</h2><p>{subtitle}</p></div>{action}</div>;
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'slides', label: 'Slides', icon: Images },
    { id: 'banners', label: 'Banners', icon: ImagePlus },
    { id: 'popups', label: 'Pop-ups', icon: Megaphone },
    { id: 'library', label: 'Media library', icon: Upload },
    { id: 'trash', label: 'Trash', icon: Trash2 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: UserRound },
  ];

  return <main className="admin-root">
    {/* Logout confirm overlay */}
    {false && null}
    <header className="admin-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#fff', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger render={<button type="button" aria-label="Open admin menu" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#111' }} />}><Menu size={28} /></SheetTrigger>
          <SheetContent side="left" className="admin-side-menu">
            <SheetHeader><SheetTitle>RsWallet admin</SheetTitle><SheetDescription>Manage your user app</SheetDescription></SheetHeader>
            <nav aria-label="Admin sections" className="admin-side-nav">
              {menuItems.map(item => <button type="button" key={item.id} aria-current={tab === item.id ? 'page' : undefined} onClick={() => { setTab(item.id); setMenuOpen(false); }}><item.icon /><span>{item.label}</span>{item.id === 'trash' && trashedAssets.length > 0 && <small>{trashedAssets.length}</small>}</button>)}
            </nav>
            <div style={{ marginTop:'auto', paddingTop:16, borderTop:'1px solid #eee' }}>
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>{menuItems.find(item => item.id === tab)?.label || 'Admin'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={24} color="#4b5563" />
          <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid #fff' }}>5</span>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fef08a', color: '#854d0e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          AD
        </div>
      </div>
    </header>
    <div className="admin-workspace">
      <div className="admin-heading"><div><span className="admin-eyebrow">CONTENT CONTROL</span><h1>Your app, up to date.</h1><p>Changes save automatically and sync with your user app.</p></div><div className="admin-save-area"><span className={dirty ? 'admin-status dirty' : 'admin-status'}>{busy ? 'Saving…' : dirty ? (savePaused ? 'Needs attention' : 'Auto-saving…') : 'All changes live'}</span><Button className="admin-save" onClick={save} disabled={!dirty || busy || uploading}><Save />{busy ? 'Saving…' : 'Save changes'}</Button></div></div>
      {initial.localPreview && <p className="admin-local-note">Local preview — changes here do not affect the published app.</p>}
      {(message || error) && <div className={`admin-feedback ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>{error || message}{error && <Button variant="ghost" size="sm" onClick={reload} disabled={busy}>Reload saved content</Button>}</div>}
      <div className="admin-current-section">{menuItems.find(item => item.id === tab)?.label}</div>
      {tab === 'users' && <AdminUsers />}
      {tab === 'reports' && <AdminReports />}
      {tab === 'profile' && <AdminProfile />}
        <section hidden={tab !== 'dashboard'} aria-label="Overview">
          <div className="admin-overview-grid"><section className="admin-card admin-publish-card"><span className="admin-eyebrow">CONNECTED USER APP</span><div className="admin-connected"><span />Content sync is on</div><p>Valid changes save automatically and appear in connected user apps without refreshing.</p><div className="admin-last-saved"><Check size={16} />{saved.updatedAt ? `Last saved ${new Date(saved.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST` : 'Original screenshot content is active'}</div></section>
            <section className="admin-card"><h2>Quick controls</h2><div className="admin-quick-row"><span>Homepage slideshow</span><Toggle label="Homepage slideshow visibility" checked={content.slidesEnabled} onChange={enabled => patch({ slidesEnabled: enabled })} /></div><div className="admin-quick-row"><span>Home poster popup</span><Toggle label="Home banner visibility" checked={content.homeBanner.enabled} onChange={enabled => patch({ homeBanner: { ...content.homeBanner, enabled } })} /></div><div className="admin-quick-row"><span>Profile banner</span><Toggle label="Profile banner visibility" checked={content.profileBanner.enabled} onChange={enabled => patch({ profileBanner: { ...content.profileBanner, enabled } })} /></div><p className="admin-hint">ON/OFF changes save automatically. Save changes also sends them immediately.</p></section></div>
          <div className="admin-summary-grid">{[{ label: 'Slides', value: content.slides.length || 'Original', target: 'slides' }, { label: 'Uploaded files', value: activeAssets.length, target: 'library' }, { label: 'Telegram popup', value: content.telegram.enabled ? 'On' : 'Off', target: 'popups' }, { label: 'Image / video popup', value: content.popup.enabled ? 'On' : 'Off', target: 'popups' }].map(item => <button className="admin-card admin-summary" key={item.label} onClick={() => setTab(item.target)}><span>{item.label}</span><strong>{item.value}</strong><span>Manage →</span></button>)}</div>
          <p className="admin-privacy"><ShieldCheck />User mobile numbers appear as hashes. Wallet passwords, MPINs and authenticator secrets are never stored.</p>
        </section>
        <section hidden={tab !== 'slides'} aria-label="Slides">
          {sectionTitle('Homepage slides', 'Images rotate every 4 seconds. Drag with a finger in the user app.', <Button onClick={() => setPicker('slide')} disabled={content.slides.length >= 12}><Plus />Add slide</Button>)}
          <div className="admin-section-control"><span>Show slideshow</span><Toggle label="Show slideshow" checked={content.slidesEnabled} onChange={slidesEnabled => patch({ slidesEnabled })} /></div>
          <div className="admin-slide-grid">{content.slides.length ? content.slides.map((slide, index) => <article className="admin-card admin-slide-card" key={slide.assetId}><AssetPreview asset={getAsset(slide.assetId)} label={`Slide ${index + 1}`} /><div className="admin-slide-info"><strong>Slide {index + 1}</strong><Toggle label={`Slide ${index + 1} visibility`} checked={slide.enabled} onChange={enabled => patch({ slides: content.slides.map((s, i) => i === index ? { ...s, enabled } : s) })} /></div><p className="admin-file-name">{getAsset(slide.assetId)?.name}</p><div className="admin-card-actions"><Button variant="outline" size="sm" aria-label={`Move slide ${index + 1} earlier`} disabled={index === 0} onClick={() => moveSlide(index, -1)}><ArrowUp /></Button><Button variant="outline" size="sm" aria-label={`Move slide ${index + 1} later`} disabled={index === content.slides.length - 1} onClick={() => moveSlide(index, 1)}><ArrowDown /></Button><Button variant="ghost" size="sm" onClick={() => patch({ slides: content.slides.filter((_, i) => i !== index) })}><X />Remove</Button></div></article>) : <article className="admin-card admin-slide-card"><AssetPreview label="slideshow" fallback="slide" /><h3>Original screenshot slide</h3><p className="admin-hint">Add your first image to replace this slide.</p></article>}</div>
        </section>
        <section hidden={tab !== 'banners'} aria-label="Banners">
          {sectionTitle('Banners', 'Home poster popups and profile banners are separate from your slideshow.')}
          <div className="admin-banner-grid">
            <article className="admin-card">
              <div className="admin-slide-info"><h3>Home · Poster popup</h3><Toggle label="Home poster popup visibility" checked={content.homeBanner.enabled} onChange={enabled => patch({ homeBanner: { ...content.homeBanner, enabled } })} /></div>
              <p className="admin-hint">Appears over Home when enabled. Users can close it with ×.</p>
              <div className="admin-poster-preview"><AssetPreview asset={getAsset(content.homeBanner.assetId)} label="Home poster" /></div>
              <p className="admin-hint">Recommended: portrait 3 : 4 (900 × 1200 px). The entire image fits without cropping.</p>
              {!content.homeBanner.assetId && <p className="admin-hint">Choose a poster image to display this popup.</p>}
              <div className="admin-card-actions"><Button variant="outline" onClick={() => setPicker('homeBanner')}><ImagePlus />{content.homeBanner.assetId ? 'Change poster' : 'Upload poster'}</Button>{content.homeBanner.assetId && <Button variant="ghost" onClick={() => patch({ homeBanner: { enabled: false, assetId: null } })}>Remove poster</Button>}</div>
            </article>
            <article className="admin-card">
              <div className="admin-slide-info"><h3>Profile · Invite rewards</h3><Toggle label="profileBanner visibility" checked={content.profileBanner.enabled} onChange={enabled => patch({ profileBanner: { ...content.profileBanner, enabled } })} /></div>
              <div className="admin-banner-preview"><AssetPreview asset={getAsset(content.profileBanner.assetId)} label="Profile banner" fallback={content.profileBanner.assetId ? undefined : 'profile'} /></div>
              <p className="admin-hint">Recommended ratio: 4.8 : 1. Shown inside the Profile page.</p>
              <div className="admin-card-actions"><Button variant="outline" onClick={() => setPicker('profileBanner')}><ImagePlus />Change image</Button>{content.profileBanner.assetId && <Button variant="ghost" onClick={() => patch({ profileBanner: { ...content.profileBanner, assetId: null } })}>Use original</Button>}</div>
            </article>
          </div>
        </section>
        <section hidden={tab !== 'popups'} aria-label="Pop-ups">
          {sectionTitle('Pop-ups', 'Show an announcement when the user opens Home. Each can be dismissed.')}
          <div className="admin-popup-grid"><section className="admin-card"><div className="admin-slide-info"><h3>Telegram</h3><Toggle label="Telegram popup visibility" checked={content.telegram.enabled} onChange={enabled => patch({ telegram: { ...content.telegram, enabled } })} /></div><label className="admin-field">Title<Input value={content.telegram.title} maxLength={60} onChange={e => patch({ telegram: { ...content.telegram, title: e.target.value } })} /></label><label className="admin-field">Message<textarea value={content.telegram.message} maxLength={360} rows={4} onChange={e => patch({ telegram: { ...content.telegram, message: e.target.value } })} /></label><label className="admin-field">Telegram channel link<Input value={content.telegram.url} inputMode="url" placeholder="https://t.me/yourchannel" onChange={e => patch({ telegram: { ...content.telegram, url: e.target.value } })} /></label><p className="admin-hint">Join opens this link. Add a channel link before switching it on.</p></section>
            <section className="admin-card"><div className="admin-slide-info"><h3>Image / video</h3><Toggle label="Media popup visibility" checked={content.popup.enabled} onChange={enabled => patch({ popup: { ...content.popup, enabled } })} /></div><label className="admin-field">Title<Input value={content.popup.title} maxLength={80} onChange={e => patch({ popup: { ...content.popup, title: e.target.value } })} /></label><div className="admin-popup-preview"><AssetPreview asset={getAsset(content.popup.assetId)} label={content.popup.title} /></div><Button variant="outline" onClick={() => setPicker('popup')}><Upload />Choose image or video</Button><p className="admin-hint">Videos use play controls and do not autoplay with sound. Telegram appears first if both popups are on.</p></section></div>
        </section>
        <section hidden={tab !== 'library'} aria-label="Media library">
          {sectionTitle('Media library', 'Uploaded files stay here until you move them to Trash.', <Button onClick={() => setPicker('library')}><Upload />Upload file</Button>)}
          {activeAssets.length ? <div className="admin-library-grid">{activeAssets.map(asset => <article className="admin-card admin-library-card" key={asset.id}><AssetPreview asset={asset} label={asset.name} /><p className="admin-file-name">{asset.name}</p><div className="admin-slide-info"><small>{(asset.size / 1024 / 1024).toFixed(2)} MB</small><Button variant="ghost" size="sm" disabled={busy} onClick={() => trash(asset, true)}><Trash2 />Move to Trash</Button></div></article>)}</div> : <div className="admin-empty-state"><Images /><h3>No uploads yet</h3><p>Add images for slides and banners, or a video for your popup.</p><Button onClick={() => setPicker('library')}>Upload your first file</Button></div>}
        </section>
        <section hidden={tab !== 'trash'} aria-label="Trash">
          {tab === 'trash' && <div className="admin-trash-users"><AdminUsers trashed /></div>}
          {sectionTitle('Trash', 'Files are hidden from the app, not permanently deleted. Restore them any time.')}
          {trashedAssets.length ? <div className="admin-trash-list">{trashedAssets.map(asset => <article className="admin-card admin-trash-row" key={asset.id}><Trash2 /><div><strong>{asset.name}</strong><small>{(asset.size / 1024 / 1024).toFixed(2)} MB · {asset.type.startsWith('video/') ? 'Video' : 'Image'}</small></div><Button variant="outline" disabled={busy} onClick={() => trash(asset, false)}><RotateCcw />Restore</Button></article>)}</div> : <div className="admin-empty-state"><Trash2 /><h3>Trash is empty</h3><p>Files moved from your media library will appear here.</p></div>}
        </section>
      <footer className="admin-footer"><span>RsWallet admin</span><button type="button" onClick={() => { void signOutAdmin().catch(e => setError(e.message)); }}>Sign out</button></footer>
    </div>
    <Dialog open={!!picker} onOpenChange={open => { if (!open && !uploading) setPicker(null); }}><DialogContent className="admin-picker"><DialogTitle>{picker === 'library' ? 'Upload to media library' : picker === 'homeBanner' ? 'Choose Home poster' : 'Choose media'}</DialogTitle><DialogDescription>JPG, PNG, WebP or GIF up to 10 MB. {picker === 'popup' || picker === 'library' ? 'MP4 or WebM up to 25 MB.' : picker === 'homeBanner' ? 'Use a portrait image, ideally 900 × 1200 px.' : 'Use a landscape image for the best fit.'}</DialogDescription>
      <label className="admin-upload-area"><Upload /><strong>{uploading ? 'Uploading…' : 'Upload from gallery'}</strong><span>Choose a file from your device</span><Input type="file" aria-label="Upload media file" disabled={uploading} accept={picker === 'popup' || picker === 'library' ? 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/gif'} onChange={event => { void upload(event.target.files?.[0]); event.target.value = ''; }} /></label>
      {error && <p role="alert" className="admin-picker-error">{error}</p>}
      {picker !== 'library' && <div className="admin-picker-grid">{activeAssets.filter(asset => picker === 'popup' || asset.type.startsWith('image/')).map(asset => <button key={asset.id} disabled={uploading} className="admin-picker-item" onClick={() => chooseAsset(asset)}>{asset.type.startsWith('video/') ? <span className="admin-video-label">Video</span> : <img src={`/api/media/${asset.id}`} alt="" />}<span>{asset.name}</span></button>)}</div>}
    </DialogContent></Dialog>
  </main>;
}
