'use client';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { defaultContent, publicContent, type PublicContent } from '@/lib/site-content';
const fallback = publicContent(defaultContent(), []);
export function useSiteContent() {
  const client = useQueryClient();
  const [connected, setConnected] = useState(false);
  const query = useQuery<PublicContent>({
    queryKey: ['public-content'],
    queryFn: async ({ signal }) => { const response = await fetch('/api/content', { signal, cache: 'no-store' }); if (!response.ok) throw new Error('Content unavailable'); return response.json(); },
    refetchInterval: connected ? 30_000 : 1500, refetchIntervalInBackground: true,
    refetchOnWindowFocus: true, staleTime: 1000, retry: 1,
  });
  useEffect(() => {
    let active = true;
    const apply = async (content: PublicContent) => {
      await client.cancelQueries({ queryKey: ['public-content'] });
      if (!active) return;
      client.setQueryData<PublicContent>(['public-content'], current => current && current.revision > content.revision ? current : content);
    };
    const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('rswallet-content');
    if (channel) channel.onmessage = event => { if (event.data?.type === 'content') void apply(event.data.content); };
    const events = new EventSource('/api/content/stream');
    events.addEventListener('content', event => {
      try { void apply(JSON.parse((event as MessageEvent).data)); setConnected(true); } catch { /* Reconnect or polling will recover an incomplete event. */ }
    });
    events.onerror = () => setConnected(false);
    const refresh = () => { void client.invalidateQueries({ queryKey: ['public-content'] }); };
    window.addEventListener('online', refresh);
    return () => { active = false; events.close(); channel?.close(); window.removeEventListener('online', refresh); };
  }, [client]);
  return query.data ?? fallback;
}
