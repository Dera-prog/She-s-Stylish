import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:4010',
    },
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
  },
});
