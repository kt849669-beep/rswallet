'use client';
import { useQuery } from '@tanstack/react-query';
import { defaultContent, publicContent, type PublicContent } from '@/lib/site-content';
const fallback = publicContent(defaultContent(), []);
export function useSiteContent() {
  const query = useQuery<PublicContent>({
    queryKey: ['public-content'],
    queryFn: async ({ signal }) => { const response = await fetch('/api/content', { signal, cache: 'no-store' }); if (!response.ok) throw new Error('Content unavailable'); return response.json(); },
    refetchInterval: 2500, refetchOnWindowFocus: true, staleTime: 1500, retry: 1,
  });
  return query.data ?? fallback;
}
