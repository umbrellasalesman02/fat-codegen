import { defineConfig } from 'vite';

const apiTarget = process.env.API_BASE_URL ?? 'http://127.0.0.1:3737';
const webPort = Number(process.env.WEB_PORT ?? '4173');

export default defineConfig({
  preview: {
    host: '127.0.0.1',
    port: webPort,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: webPort,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
