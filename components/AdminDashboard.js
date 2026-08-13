'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const tabs = ['overview','users','sliders','banners','video','telegram','notifications','trash','activity'];
const empty = { users: [], slides: [], banners: [], notifications: [], trash: [], activity: [], video: null, telegram: null };
const label = (value) => value.charAt(0).toUpperCase() + value.slice(1).replaceAll('_', ' ');
const show = (value) => value == null || value === '' ? '—' : typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) ? new Date(value).toLocaleString() : String(value);

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('overview');
  const [message, setMessage] = useState('');

  async function refresh() {
    const response = await fetch('/api/admin/overview', { cache: 'no-store' });
    if (response.status === 401) { router.replace('/admin/login'); return; }
    setData(response.ok ? await response.json() : empty);
  }

  useEffect(() => { refresh().catch(() => setData(empty)); }, []);

  async function save(resource, values, id) {
    setMessage('Saving…');
    const response = await fetch('/api/admin/resource', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resource, values, id }) });
    const result = await response.json();
    setMessage(response.ok ? 'Saved successfully.' : result.error || 'Unable to save.');
    if (response.ok) await refresh();
    return response.ok;
  }

  async function remove(resource, id) {
    if (!window.confirm('Remove this item?')) return;
    const response = await fetch('/api/admin/resource', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resource, id }) });
    setMessage(response.ok ? 'Removed successfully.' : 'Unable to remove.');
    if (response.ok) await refresh();
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  if (!data) return <main className="center-screen">Loading RsWallet admin…</main>;
  return (
    <main className="admin-shell">
      <aside>
        <div className="admin-brand"><span>R</span><div><h1>RsWallet</h1><small>ADMIN PANEL</small></div></div>
        <nav>{tabs.map((name) => <button key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{label(name)}</button>)}</nav>
        <button className="admin-logout" onClick={logout}>Log out</button>
      </aside>
      <section>
        <div className="section-heading"><div><p>RsWallet control centre</p><h2>{label(tab)}</h2></div><button className="outline-button" onClick={refresh}>Refresh</button></div>
        {message && <p className="admin-message">{message}</p>}
        {tab === 'overview' && <Overview data={data} />}
        {tab === 'users' && <SimpleTable rows={data.users} columns={['mobile','mpin','status','login_count','created_at']} format={{ mpin: (value) => value ? 'Set' : 'Not set' }} />}
        {tab === 'sliders' && <Media resource="sliders" rows={data.slides} save={save} remove={remove} />}
        {tab === 'banners' && <Media resource="banners" rows={data.banners} save={save} remove={remove} />}
        {tab === 'video' && <Setting resource="video" item={data.video} save={save} />}
        {tab === 'telegram' && <Setting resource="telegram" item={data.telegram} save={save} />}
        {tab === 'notifications' && <Notifications rows={data.notifications} save={save} remove={remove} />}
        {tab === 'trash' && <SimpleTable rows={data.trash} columns={['original_table','record_id','deleted_at']} />}
        {tab === 'activity' && <SimpleTable rows={data.activity} columns={['action','details','created_at']} />}
      </section>
    </main>
  );
}

function Overview({ data }) {
  const metrics = [['Users',data.users.length],['Slides',data.slides.length],['Banners',data.banners.length],['Notifications',data.notifications.length],['Trash',data.trash.length],['Activity events',data.activity.length]];
  return <div className="metric-grid">{metrics.map(([name, value], index) => <article key={name}><span>0{index + 1}</span><small>{name}</small><strong>{value}</strong></article>)}</div>;
}

function SimpleTable({ rows, columns, format = {} }) {
  return <div className="table-wrap"><table><thead><tr>{columns.map((column) => <th key={column}>{label(column)}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id || index}>{columns.map((column) => <td key={column}>{format[column] ? format[column](row[column]) : show(row[column])}</td>)}</tr>)}{!rows.length && <tr><td colSpan={columns.length}>No records found.</td></tr>}</tbody></table></div>;
}

function Media({ resource, rows, save, remove }) {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setUploading(true);
    try {
      let imageUrl = url;
      if (file) {
        const form = new FormData();
        form.set('file', file);
        form.set('resource', resource);
        const response = await fetch('/api/admin/upload', { method: 'POST', body: form });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Upload failed.');
        imageUrl = result.url;
      }
      if (!imageUrl) throw new Error('Choose an image file or enter an image URL.');
      const saved = await save(resource, { image_url: imageUrl, title, display_order: rows.length, is_enabled: true });
      if (saved) { setFile(null); setUrl(''); setTitle(''); formElement.reset(); }
    } catch (error) {
      window.alert(error.message);
    } finally { setUploading(false); }
  }

  return <>
    <form className="admin-form media-form" onSubmit={submit}>
      <div><label htmlFor={`${resource}-title`}>Image title</label><input id={`${resource}-title`} value={title} onChange={(event) => setTitle(event.target.value)} placeholder={resource === 'sliders' ? 'Home slide title' : 'Reward banner title'} /></div>
      <div><label htmlFor={`${resource}-file`}>Upload image</label><input id={`${resource}-file`} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => setFile(event.target.files?.[0] || null)} /></div>
      <div><label htmlFor={`${resource}-url`}>Or use image URL</label><input id={`${resource}-url`} type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://…" /></div>
      <button className="primary" disabled={uploading}>{uploading ? 'Uploading…' : `Add ${resource === 'sliders' ? 'slide' : 'banner'}`}</button>
    </form>
    <div className="cards media-cards">{rows.map((item) => <article key={item.id}><img src={item.image_url} alt={item.title || label(resource)} /><div><strong>{item.title || 'Untitled'}</strong><small>Order {item.display_order ?? 0} · {item.is_enabled === false ? 'Disabled' : 'Enabled'}</small></div><div className="card-actions"><button className="outline-button" onClick={() => save(resource, { is_enabled: item.is_enabled === false }, item.id)}>{item.is_enabled === false ? 'Enable' : 'Disable'}</button><button className="danger-button" onClick={() => remove(resource, item.id)}>Remove</button></div></article>)}</div>
    {!rows.length && <div className="empty-state">No images yet. Upload the first RsWallet {resource === 'sliders' ? 'home slide' : 'reward banner'} above.</div>}
  </>;
}

function Setting({ resource, item, save }) {
  const video = resource === 'video';
  const key = video ? 'video_url' : 'telegram_link';
  const [url, setUrl] = useState(item?.[key] || '');
  const [title, setTitle] = useState(item?.title || '');
  const [desc, setDesc] = useState(item?.description || '');
  const [enabled, setEnabled] = useState(Boolean(item?.is_enabled));
  function submit(event) { event.preventDefault(); save(resource, { [key]: url, title, ...(video ? {} : { description: desc }), is_enabled: enabled }, item?.id); }
  return <form className="settings-form" onSubmit={submit}><label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label>{video ? 'Video URL' : 'Telegram URL'}<input type="url" value={url} onChange={(event) => setUrl(event.target.value)} required /></label>{!video && <label>Description<textarea value={desc} onChange={(event) => setDesc(event.target.value)} /></label>}<label className="check"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /> Enabled</label><button className="primary">Save settings</button></form>;
}

function Notifications({ rows, save, remove }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  function submit(event) { event.preventDefault(); save('notifications', { title, message, type: 'info', is_read: false }); setTitle(''); setMessage(''); }
  return <><form className="admin-form" onSubmit={submit}><div><label>Title</label><input value={title} onChange={(event) => setTitle(event.target.value)} required /></div><div><label>Message</label><input value={message} onChange={(event) => setMessage(event.target.value)} required /></div><button className="primary">Create</button></form><div className="list">{rows.map((item) => <article key={item.id}><div><strong>{item.title}</strong><p>{item.message}</p></div><button className="danger-button" onClick={() => remove('notifications', item.id)}>Remove</button></article>)}</div></>;
}
