import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: './',
  server: {
    strictPort: true,
    port: 3001,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'generateSW',
      injectRegister: 'auto',
      registerType: 'prompt',
      filename: 'service-worker.js',
      manifestFilename: 'birdle.webmanifest',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
      },
      includeAssets: ['./favicon.png'],
      manifest: {
        name: 'BIRDLE',
        short_name: 'BIRDLE',
        description: 'A new BIRDLE every day',
        icons: [
          {
            src: 'https://res.cloudinary.com/mikesprague/image/upload/fl_preserve_transparency,w_32,h_32,c_scale/birdle/favicon.png',
            type: 'image/png',
            sizes: '32x32',
            purpose: 'any',
          },
          {
            src: 'https://res.cloudinary.com/mikesprague/image/upload/fl_preserve_transparency,w_128,h_128,c_scale/birdle/favicon.png',
            type: 'image/png',
            sizes: '128x128',
            purpose: 'any',
          },
          {
            src: 'https://res.cloudinary.com/mikesprague/image/upload/fl_preserve_transparency,w_152,h_152,c_scale/birdle/favicon.png',
            type: 'image/png',
            sizes: '152x152',
            purpose: 'any',
          },
          {
            src: 'https://res.cloudinary.com/mikesprague/image/upload/fl_preserve_transparency,w_167,h_167,c_scale/birdle/favicon.png',
            type: 'image/png',
            sizes: '167x167',
            purpose: 'any',
          },
          {
            src: 'https://res.cloudinary.com/mikesprague/image/upload/fl_preserve_transparency,w_180,h_180,c_scale/birdle/favicon.png',
            type: 'image/png',
            sizes: '180x180',
            purpose: 'any',
          },
          {
            src: 'https://res.cloudinary.com/mikesprague/image/upload/fl_preserve_transparency,w_192,h_192,c_scale/birdle/favicon.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any',
          },
          {
            src: 'https://res.cloudinary.com/mikesprague/image/upload/fl_preserve_transparency,w_196,h_196,c_scale/birdle/favicon.png',
            type: 'image/png',
            sizes: '196x196',
            purpose: 'any',
          },
          {
            src: 'https://res.cloudinary.com/mikesprague/image/upload/fl_preserve_transparency,w_512,h_512,c_scale/birdle/favicon.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any',
          },
          {
            src: 'https://res.cloudinary.com/mikesprague/image/upload/fl_preserve_transparency,w_512,h_512,c_scale/birdle/favicon.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
        ],
        lang: 'en-US',
        dir: 'ltr',
        orientation: 'portrait',
        id: '/',
        scope: '/',
        start_url: '/',
        display: 'standalone',
        background_color: '#181818',
        theme_color: '#581c87',
      },
    }),
  ],
});
