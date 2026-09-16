import { createClient } from '@supabase/supabase-js';

// Use env vars or fallback to hardcoded
const supabaseUrl = process.env.SUPABASE_URL || 'https://zqaxxgyukyjrdnpxywpp.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_hSQ_4bycFY--ns2bX8uMgw_2BGoHp5I';

export const supabase = createClient(supabaseUrl, supabaseKey);

class MockD1Statement {
  constructor(public queryStr: string, public args: any[] = []) {}
  bind(...args: any[]) {
    return new MockD1Statement(this.queryStr, args);
  }
  _getSql() {
    let i = 1;
    let q = this.queryStr.replace(/\?/g, () => `$${i++}`);
    q = q.replace(/INSERT OR IGNORE INTO admin_accounts(.*?)\)/ig, 'INSERT INTO admin_accounts$1) ON CONFLICT (id) DO NOTHING');
    return q;
  }
  async run() {
    const { data, error } = await supabase.rpc('pg_exec', { query_text: this._getSql(), params: this.args });
    if (error) throw new Error(error.message);
    return { meta: { changes: 1 } };
  }
  async all<T = any>() {
    const { data, error } = await supabase.rpc('pg_exec', { query_text: this._getSql(), params: this.args });
    if (error) throw new Error(error.message);
    return { results: (data as any) || [] };
  }
  async first<T = any>() {
    const { data, error } = await supabase.rpc('pg_exec', { query_text: this._getSql(), params: this.args });
    if (error) throw new Error(error.message);
    return (data && Array.isArray(data) && data.length > 0 ? data[0] : null) as T | null;
  }
}

const dbMock = {
  prepare: (query: string) => new MockD1Statement(query),
  batch: async (statements: MockD1Statement[]) => {
    // Supabase RPC does not have a batch API out of the box, we just run sequentially.
    const results = [];
    for (const stmt of statements) {
      results.push(await stmt.run());
    }
    return results;
  }
};

const mediaMock = {
  put: async (key: string, body: ReadableStream | Blob | Buffer, options?: any) => {
    // Note: Supabase storage upload needs arraybuffer, blob, or file
    let data = body;
    if (body instanceof ReadableStream) {
       const reader = body.getReader();
       const chunks = [];
       while (true) {
         const { done, value } = await reader.read();
         if (done) break;
         chunks.push(value);
       }
       data = new Blob(chunks);
    }
    const { data: d, error } = await supabase.storage.from('media').upload(key, data, {
      contentType: options?.httpMetadata?.contentType,
      upsert: true
    });
    if (error) throw error;
  },
  delete: async (key: string) => {
    await supabase.storage.from('media').remove([key]);
  },
  get: async (key: string) => {
    const { data, error } = await supabase.storage.from('media').download(key);
    if (error || !data) return null;
    return {
      body: data.stream(),
      headers: new Headers({ 'Content-Type': data.type })
    };
  }
};

export const bindings = () => ({ DB: dbMock, MEDIA: mediaMock }) as any;
export const noStore = { 'Cache-Control': 'no-store, private', 'X-Content-Type-Options': 'nosniff' };
export function json(value: unknown, status = 200) { return Response.json(value, { status, headers: noStore }); }
export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin && request.headers.get('sec-fetch-site') !== 'cross-site';
}
