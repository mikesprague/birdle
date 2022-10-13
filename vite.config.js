import { VitePWA } from 'vite-plugin-pwa';
import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';
import { version } from './package.json';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
  },
  publicDir: '../public',
  base: './',
  outDir: './',
  appType: 'spa',
  server: {
    strictPort: true,
  },
  plugins: [
    createHtmlPlugin({
      template: 'index.html',
      inject: {
        data: {
          appVersion: version,
        },
      },
    }),
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
        version,
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
        dir: 'auto',
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
