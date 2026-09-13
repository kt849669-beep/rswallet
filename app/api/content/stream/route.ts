import { readAssets, readContent } from '@/lib/content-server';
import { publicContent } from '@/lib/site-content';
export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const encoder = new TextEncoder();
  let stop = () => {};
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      let previous = '';
      let timer: ReturnType<typeof setTimeout>;
      let ticks = 0;
      stop = () => {
        if (closed) return;
        closed = true;
        clearTimeout(timer);
        request.signal.removeEventListener('abort', stop);
        try { controller.close(); } catch { /* Already cancelled by the client. */ }
      };
      request.signal.addEventListener('abort', stop, { once: true });
      if (request.signal.aborted) { stop(); return; }
      controller.enqueue(encoder.encode('retry: 1000\n\n'));
      const tick = async () => {
        try {
          const [content, assets] = await Promise.all([readContent(), readAssets()]);
          if (closed) return;
          const document = JSON.stringify(publicContent(content, assets));
          if (document !== previous) {
            controller.enqueue(encoder.encode(`event: content\ndata: ${document}\n\n`));
            previous = document;
          } else if (++ticks % 20 === 0) controller.enqueue(encoder.encode(': heartbeat\n\n'));
          timer = setTimeout(() => { void tick(); }, 750);
        } catch { stop(); }
      };
      void tick();
    },
    cancel() { stop(); },
  });
  return new Response(stream, { headers: {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, no-transform',
    'X-Accel-Buffering': 'no',
    'X-Content-Type-Options': 'nosniff',
  } });
}
