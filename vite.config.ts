import { defineConfig } from 'vite';
import vinext from 'vinext';
import { nitro } from 'nitro/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(async () => {
  return {
    cacheDir: process.env.RSWALLET_TEST_STATE ? 'node_modules/.vite-rswallet-test' : undefined,
    plugins: [
      tailwindcss(),
      vinext(),
      nitro()
    ],
  };
});
