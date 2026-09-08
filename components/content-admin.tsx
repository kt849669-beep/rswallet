'use client';
import { useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Check, ExternalLink, ImagePlus, Images, LayoutDashboard, Megaphone, Plus, RotateCcw, Save, ShieldCheck, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { AdminData, ContentSettings, MediaAsset } from '@/lib/site-content';

type Target = 'slide' | 'homeBanner' | 'profileBanner' | 'popup' | 'library';
async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, cache: 'no-store' });
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
  const [tab, setTab] = useState('dashboard');
  const [picker, setPicker] = useState<Target | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const dirty = JSON.stringify(content) !== JSON.stringify(saved);
  const activeAssets = assets.filter(a => !a.deletedAt);
  const trashedAssets = assets.filter(a => a.deletedAt);
  const getAsset = (id: string | null) => assets.find(a => a.id === id);
  const patch = (next: Partial<ContentSettings>) => { setContent(current => ({ ...current, ...next })); setMessage(''); setError(''); };

  const save = async () => {
    setBusy(true); setError(''); setMessage('');
    try { const result = await api<AdminData>('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) }); setContent(result.content); setSaved(result.content); setAssets(result.assets); setMessage('Saved. Open user apps update within a few seconds.'); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };
  const reload = async () => {
    setBusy(true); setError('');
    try { const result = await api<AdminData>('/api/admin/content'); setContent(result.content); setSaved(result.content); setAssets(result.assets); setMessage('Latest saved content loaded.'); }
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
    try { const form = new FormData(); form.append('file', file); const result = await api<{ asset: MediaAsset }>('/api/admin/media', { method: 'POST', body: form }); setAssets(current => [result.asset, ...current]); if (picker !== 'library') chooseAsset(result.asset); setMessage(picker === 'library' ? 'File uploaded to your media library.' : 'File selected. Save changes to show it in the user app.'); }
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

  return <main className="admin-root">
    <header className="admin-header"><a className="admin-brand" href="/admin"><img src="/rswallet-logo.jpeg" alt="" /><span>RsWallet <small>CONTENT ADMIN · DEMO</small></span></a><div className="admin-header-actions"><span className="admin-owner"><ShieldCheck />Owner access</span><a href="/home" target="_blank" rel="noopener noreferrer" className="admin-app-link">Open user app <ExternalLink size={15} /></a></div></header>
    <div className="admin-workspace">
      <div className="admin-heading"><div><span className="admin-eyebrow">CONTENT CONTROL</span><h1>Your app, up to date.</h1><p>Manage what appears in the mobile demo.</p></div><div className="admin-save-area"><span className={dirty ? 'admin-status dirty' : 'admin-status'}>{dirty ? 'Unsaved changes' : 'All changes saved'}</span><Button className="admin-save" onClick={save} disabled={!dirty || busy || uploading}><Save />{busy ? 'Saving…' : 'Save changes'}</Button></div></div>
      {initial.localPreview && <p className="admin-local-note">Local preview — changes here do not affect the published app.</p>}
      {(message || error) && <div className={`admin-feedback ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}>{error || message}{error && <Button variant="ghost" size="sm" onClick={reload} disabled={busy}>Reload saved content</Button>}</div>}
      <Tabs value={tab} onValueChange={value => setTab(String(value))}>
        <TabsList className="admin-tabs" variant="line">
          <TabsTrigger value="dashboard"><LayoutDashboard />Overview</TabsTrigger><TabsTrigger value="slides"><Images />Slides</TabsTrigger><TabsTrigger value="banners"><ImagePlus />Banners</TabsTrigger><TabsTrigger value="popups"><Megaphone />Pop-ups</TabsTrigger><TabsTrigger value="library"><Upload />Media library</TabsTrigger><TabsTrigger value="trash"><Trash2 />Trash{trashedAssets.length ? ` (${trashedAssets.length})` : ''}</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="admin-overview-grid"><section className="admin-card admin-publish-card"><span className="admin-eyebrow">CONNECTED USER APP</span><div className="admin-connected"><span />Content sync is on</div><p>Saved changes appear in open user apps in about 2–3 seconds.</p><div className="admin-last-saved"><Check size={16} />{saved.updatedAt ? `Last saved ${new Date(saved.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST` : 'Original screenshot content is active'}</div><a href="/home" target="_blank" rel="noopener noreferrer" className="admin-text-link">Preview user app <ExternalLink size={15} /></a></section>
            <section className="admin-card"><h2>Quick controls</h2><div className="admin-quick-row"><span>Homepage slideshow</span><Toggle label="Homepage slideshow visibility" checked={content.slidesEnabled} onChange={enabled => patch({ slidesEnabled: enabled })} /></div><div className="admin-quick-row"><span>Home banner</span><Toggle label="Home banner visibility" checked={content.homeBanner.enabled} onChange={enabled => patch({ homeBanner: { ...content.homeBanner, enabled } })} /></div><div className="admin-quick-row"><span>Profile banner</span><Toggle label="Profile banner visibility" checked={content.profileBanner.enabled} onChange={enabled => patch({ profileBanner: { ...content.profileBanner, enabled } })} /></div><p className="admin-hint">Use Save changes to publish these controls.</p></section></div>
          <div className="admin-summary-grid">{[{ label: 'Slides', value: content.slides.length || 'Original', target: 'slides' }, { label: 'Uploaded files', value: activeAssets.length, target: 'library' }, { label: 'Telegram popup', value: content.telegram.enabled ? 'On' : 'Off', target: 'popups' }, { label: 'Image / video popup', value: content.popup.enabled ? 'On' : 'Off', target: 'popups' }].map(item => <button className="admin-card admin-summary" key={item.label} onClick={() => setTab(item.target)}><span>{item.label}</span><strong>{item.value}</strong><span>Manage →</span></button>)}</div>
          <p className="admin-privacy"><ShieldCheck />Content only. This admin never receives or stores wallet mobile numbers, passwords, MPINs or authenticator secrets.</p>
        </TabsContent>
        <TabsContent value="slides">
          {sectionTitle('Homepage slides', 'Images rotate every 4 seconds. Drag with a finger in the user app.', <Button onClick={() => setPicker('slide')} disabled={content.slides.length >= 12}><Plus />Add slide</Button>)}
          <div className="admin-section-control"><span>Show slideshow</span><Toggle label="Show slideshow" checked={content.slidesEnabled} onChange={slidesEnabled => patch({ slidesEnabled })} /></div>
          <div className="admin-slide-grid">{content.slides.length ? content.slides.map((slide, index) => <article className="admin-card admin-slide-card" key={slide.assetId}><AssetPreview asset={getAsset(slide.assetId)} label={`Slide ${index + 1}`} /><div className="admin-slide-info"><strong>Slide {index + 1}</strong><Toggle label={`Slide ${index + 1} visibility`} checked={slide.enabled} onChange={enabled => patch({ slides: content.slides.map((s, i) => i === index ? { ...s, enabled } : s) })} /></div><p className="admin-file-name">{getAsset(slide.assetId)?.name}</p><div className="admin-card-actions"><Button variant="outline" size="sm" aria-label={`Move slide ${index + 1} earlier`} disabled={index === 0} onClick={() => moveSlide(index, -1)}><ArrowUp /></Button><Button variant="outline" size="sm" aria-label={`Move slide ${index + 1} later`} disabled={index === content.slides.length - 1} onClick={() => moveSlide(index, 1)}><ArrowDown /></Button><Button variant="ghost" size="sm" onClick={() => patch({ slides: content.slides.filter((_, i) => i !== index) })}><X />Remove</Button></div></article>) : <article className="admin-card admin-slide-card"><AssetPreview label="slideshow" fallback="slide" /><h3>Original screenshot slide</h3><p className="admin-hint">Add your first image to replace this slide.</p></article>}</div>
        </TabsContent>
        <TabsContent value="banners">
          {sectionTitle('Banners', 'Replace the image while keeping the screenshot’s mobile layout.')}
          <div className="admin-banner-grid">{(['homeBanner', 'profileBanner'] as const).map(key => <article className="admin-card" key={key}><div className="admin-slide-info"><h3>{key === 'homeBanner' ? 'Home · Newbie Reward' : 'Profile · Invite rewards'}</h3><Toggle label={`${key} visibility`} checked={content[key].enabled} onChange={enabled => patch({ [key]: { ...content[key], enabled } })} /></div><div className="admin-banner-preview"><AssetPreview asset={getAsset(content[key].assetId)} label={key === 'homeBanner' ? 'Home banner' : 'Profile banner'} fallback={content[key].assetId ? undefined : key === 'homeBanner' ? 'home' : 'profile'} /></div><p className="admin-hint">Recommended ratio: {key === 'homeBanner' ? '4 : 1' : '4.8 : 1'}. Images fit without stretching.</p><div className="admin-card-actions"><Button variant="outline" onClick={() => setPicker(key)}><ImagePlus />Change image</Button>{content[key].assetId && <Button variant="ghost" onClick={() => patch({ [key]: { ...content[key], assetId: null } })}>Use original</Button>}</div></article>)}</div>
        </TabsContent>
        <TabsContent value="popups">
          {sectionTitle('Pop-ups', 'Show an announcement when the user opens Home. Each can be dismissed.')}
          <div className="admin-popup-grid"><section className="admin-card"><div className="admin-slide-info"><h3>Telegram</h3><Toggle label="Telegram popup visibility" checked={content.telegram.enabled} onChange={enabled => patch({ telegram: { ...content.telegram, enabled } })} /></div><label className="admin-field">Title<Input value={content.telegram.title} maxLength={60} onChange={e => patch({ telegram: { ...content.telegram, title: e.target.value } })} /></label><label className="admin-field">Message<textarea value={content.telegram.message} maxLength={360} rows={4} onChange={e => patch({ telegram: { ...content.telegram, message: e.target.value } })} /></label><label className="admin-field">Telegram channel link<Input value={content.telegram.url} inputMode="url" placeholder="https://t.me/yourchannel" onChange={e => patch({ telegram: { ...content.telegram, url: e.target.value } })} /></label><p className="admin-hint">Join opens this link. Add a channel link before switching it on.</p></section>
            <section className="admin-card"><div className="admin-slide-info"><h3>Image / video</h3><Toggle label="Media popup visibility" checked={content.popup.enabled} onChange={enabled => patch({ popup: { ...content.popup, enabled } })} /></div><label className="admin-field">Title<Input value={content.popup.title} maxLength={80} onChange={e => patch({ popup: { ...content.popup, title: e.target.value } })} /></label><div className="admin-popup-preview"><AssetPreview asset={getAsset(content.popup.assetId)} label={content.popup.title} /></div><Button variant="outline" onClick={() => setPicker('popup')}><Upload />Choose image or video</Button><p className="admin-hint">Videos use play controls and do not autoplay with sound. Telegram appears first if both popups are on.</p></section></div>
        </TabsContent>
        <TabsContent value="library">
          {sectionTitle('Media library', 'Uploaded files stay here until you move them to Trash.', <Button onClick={() => setPicker('library')}><Upload />Upload file</Button>)}
          {activeAssets.length ? <div className="admin-library-grid">{activeAssets.map(asset => <article className="admin-card admin-library-card" key={asset.id}><AssetPreview asset={asset} label={asset.name} /><p className="admin-file-name">{asset.name}</p><div className="admin-slide-info"><small>{(asset.size / 1024 / 1024).toFixed(2)} MB</small><Button variant="ghost" size="sm" disabled={busy} onClick={() => trash(asset, true)}><Trash2 />Move to Trash</Button></div></article>)}</div> : <div className="admin-empty-state"><Images /><h3>No uploads yet</h3><p>Add images for slides and banners, or a video for your popup.</p><Button onClick={() => setPicker('library')}>Upload your first file</Button></div>}
        </TabsContent>
        <TabsContent value="trash">
          {sectionTitle('Trash', 'Files are hidden from the app, not permanently deleted. Restore them any time.')}
          {trashedAssets.length ? <div className="admin-trash-list">{trashedAssets.map(asset => <article className="admin-card admin-trash-row" key={asset.id}><Trash2 /><div><strong>{asset.name}</strong><small>{(asset.size / 1024 / 1024).toFixed(2)} MB · {asset.type.startsWith('video/') ? 'Video' : 'Image'}</small></div><Button variant="outline" disabled={busy} onClick={() => trash(asset, false)}><RotateCcw />Restore</Button></article>)}</div> : <div className="admin-empty-state"><Trash2 /><h3>Trash is empty</h3><p>Files moved from your media library will appear here.</p></div>}
        </TabsContent>
      </Tabs>
      <footer className="admin-footer"><span>RsWallet demo · Content management only</span><a href="/signout-with-chatgpt?return_to=%2Fadmin" target="_top">Sign out</a></footer>
    </div>
    <Dialog open={!!picker} onOpenChange={open => { if (!open && !uploading) setPicker(null); }}><DialogContent className="admin-picker"><DialogTitle>{picker === 'library' ? 'Upload to media library' : 'Choose media'}</DialogTitle><DialogDescription>JPG, PNG, WebP or GIF up to 10 MB. {picker === 'popup' || picker === 'library' ? 'MP4 or WebM up to 25 MB.' : 'Use a landscape image for the best fit.'}</DialogDescription>
      <label className="admin-upload-area"><Upload /><strong>{uploading ? 'Uploading…' : 'Upload from gallery'}</strong><span>Choose a file from your device</span><Input type="file" aria-label="Upload media file" disabled={uploading} accept={picker === 'popup' || picker === 'library' ? 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/gif'} onChange={event => { void upload(event.target.files?.[0]); event.target.value = ''; }} /></label>
      {error && <p role="alert" className="admin-picker-error">{error}</p>}
      {picker !== 'library' && <div className="admin-picker-grid">{activeAssets.filter(asset => picker === 'popup' || asset.type.startsWith('image/')).map(asset => <button key={asset.id} disabled={uploading} className="admin-picker-item" onClick={() => chooseAsset(asset)}>{asset.type.startsWith('video/') ? <span className="admin-video-label">Video</span> : <img src={`/api/media/${asset.id}`} alt="" />}<span>{asset.name}</span></button>)}</div>}
    </DialogContent></Dialog>
  </main>;
}
