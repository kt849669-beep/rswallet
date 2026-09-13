import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
const result = spawnSync(process.execPath, [
  'node_modules/wrangler/bin/wrangler.js', 'd1', 'migrations', 'apply', 'DB',
  '--local', '--config', 'wrangler.local.jsonc',
], { cwd: root, stdio: 'inherit', env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false' } });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
