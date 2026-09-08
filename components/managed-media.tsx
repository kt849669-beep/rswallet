'use client';
import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { PublicAsset } from '@/lib/site-content';

export function ManagedSlides({ slides }: { slides: PublicAsset[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on('select', onSelect); api.on('reInit', onSelect); onSelect();
    const timer = window.setInterval(() => { if (!document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) api.scrollNext(); }, 4000);
    return () => { window.clearInterval(timer); api.off('select', onSelect); api.off('reInit', onSelect); };
  }, [api]);
  return <Carousel className="home-hero managed-slides" setApi={setApi} opts={{ loop: true }} aria-label="Homepage slides"><CarouselContent className="!ml-0">{slides.map(slide => <CarouselItem key={slide.id} className="!pl-0"><img src={slide.url} alt={slide.name} /></CarouselItem>)}</CarouselContent>{slides.length > 1 && <div className="managed-slide-dots">{slides.map((slide, index) => <button type="button" key={slide.id} aria-label={`Show slide ${index + 1}`} aria-current={selected === index ? 'true' : undefined} onClick={() => api?.scrollTo(index)} />)}</div>}</Carousel>;
}
export function MediaPopup({ asset, title, open, onOpenChange }: { asset: PublicAsset | null; title: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  return <Dialog open={open && !!asset} onOpenChange={onOpenChange}><DialogContent className="wallet-media-popup"><DialogTitle>{title}</DialogTitle><DialogDescription className="sr-only">Announcement from the demo site owner</DialogDescription>{asset && (asset.type.startsWith('video/') ? <video src={asset.url} controls playsInline preload="metadata" /> : <img src={asset.url} alt={title} />)}</DialogContent></Dialog>;
}
