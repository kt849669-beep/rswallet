export type MediaAsset = { id: string; name: string; type: string; size: number; createdAt: string; deletedAt: string | null };
export type Placement = { enabled: boolean; assetId: string | null };
export type ContentSettings = {
  revision: number; updatedAt: string;
  slidesEnabled: boolean;
  slides: { assetId: string; enabled: boolean }[];
  homeBanner: Placement; profileBanner: Placement;
  telegram: { enabled: boolean; title: string; message: string; url: string };
  popup: Placement & { title: string };
};
export type PublicAsset = { id: string; url: string; name: string; type: string };
export type PublicContent = Omit<ContentSettings, 'slides' | 'homeBanner' | 'profileBanner' | 'popup'> & {
  slides: PublicAsset[]; defaultSlide: boolean;
  homeBanner: { enabled: boolean; asset: PublicAsset | null; useDefault: boolean };
  profileBanner: { enabled: boolean; asset: PublicAsset | null; useDefault: boolean };
  popup: { enabled: boolean; title: string; asset: PublicAsset | null };
};
export type AdminData = { content: ContentSettings; assets: MediaAsset[]; localPreview: boolean };

export function defaultContent(): ContentSettings {
  return {
    revision: 0, updatedAt: '', slidesEnabled: true, slides: [],
    homeBanner: { enabled: true, assetId: null }, profileBanner: { enabled: true, assetId: null },
    telegram: { enabled: false, title: 'Telegram', message: 'Join our Telegram channel to get the latest updates and news.', url: '' },
    popup: { enabled: false, title: 'Latest update', assetId: null },
  };
}
export function publicContent(content: ContentSettings, assets: MediaAsset[]): PublicContent {
  const lookup = new Map(assets.filter(a => !a.deletedAt).map(a => [a.id, { id: a.id, url: `/api/media/${a.id}`, name: a.name, type: a.type }]));
  const banner = (p: Placement) => ({ enabled: p.enabled, asset: p.assetId ? lookup.get(p.assetId) ?? null : null, useDefault: !p.assetId });
  return {
    ...content,
    slides: content.slides.filter(s => s.enabled).map(s => lookup.get(s.assetId)).filter((a): a is PublicAsset => Boolean(a)),
    defaultSlide: content.slides.length === 0,
    homeBanner: banner(content.homeBanner), profileBanner: banner(content.profileBanner),
    popup: { enabled: content.popup.enabled, title: content.popup.title, asset: content.popup.assetId ? lookup.get(content.popup.assetId) ?? null : null },
  };
}

export function validateContent(value: unknown): ContentSettings {
  if (!value || typeof value !== 'object') throw new Error('Invalid content.');
  const v = value as Record<string, unknown>;
  const boolean = (x: unknown) => { if (typeof x !== 'boolean') throw new Error('Invalid visibility setting.'); return x; };
  const str = (x: unknown, max: number) => { if (typeof x !== 'string' || x.length > max) throw new Error('Text is missing or too long.'); return x.trim(); };
  const assetId = (x: unknown) => { if (typeof x !== 'string' || !/^[a-f0-9-]{36}$/.test(x)) throw new Error('Choose a valid uploaded file.'); return x; };
  const placement = (x: unknown): Placement => {
    if (!x || typeof x !== 'object') throw new Error('Invalid placement.');
    const p = x as Record<string, unknown>;
    return { enabled: boolean(p.enabled), assetId: p.assetId === null ? null : assetId(p.assetId) };
  };
  if (!Number.isSafeInteger(v.revision) || (v.revision as number) < 0) throw new Error('Invalid revision.');
  if (!Array.isArray(v.slides) || v.slides.length > 12) throw new Error('Use up to 12 slides.');
  const slides = v.slides.map(s => ({ assetId: assetId(s?.assetId), enabled: boolean(s?.enabled) }));
  if (new Set(slides.map(s => s.assetId)).size !== slides.length) throw new Error('A slide is already in the list.');
  const t = v.telegram as Record<string, unknown> | undefined;
  if (!t || typeof t !== 'object') throw new Error('Invalid Telegram settings.');
  const telegram = { enabled: boolean(t.enabled), title: str(t.title, 60), message: str(t.message, 360), url: str(t.url, 300) };
  if (telegram.url) {
    const url = new URL(telegram.url);
    if (url.protocol !== 'https:' || !['t.me', 'telegram.me'].includes(url.hostname) || url.username || url.password || url.pathname === '/') throw new Error('Enter a Telegram channel link beginning with https://t.me/.');
  }
  if (telegram.enabled && (!telegram.url || !telegram.title || !telegram.message)) throw new Error('Add the Telegram title, message and channel link before turning it on.');
  const popup = { ...placement(v.popup), title: str((v.popup as Record<string, unknown>).title, 80) };
  if (popup.enabled && (!popup.assetId || !popup.title)) throw new Error('Choose a popup image or video and add its title.');
  return { revision: v.revision as number, updatedAt: '', slidesEnabled: boolean(v.slidesEnabled), slides, homeBanner: placement(v.homeBanner), profileBanner: placement(v.profileBanner), telegram, popup };
}
