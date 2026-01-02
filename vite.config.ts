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
  build: {
    // Vite 7 default target for better browser support
    target: 'baseline-widely-available',

    // Use Lightning CSS for faster CSS minification (Vite 7 default)
    cssMinify: 'lightningcss',

    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React vendor code
          'react-vendor': ['react', 'react-dom'],
          // Separate TinyBase (largest dependency)
          'tinybase': ['tinybase', 'tinybase/ui-react'],
          // Radix UI components
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
          ],
          // UI utilities (smaller bundle)
          'ui-utils': [
            'sonner',
            'lucide-react',
            'clsx',
            'tailwind-merge',
            'class-variance-authority',
          ],
          // Heavy utilities (for potential code splitting)
          'utils': ['dayjs', '@rwh/keystrokes', 'next-themes'],
        },
      },
      // Tree-shaking optimization
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },

    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.* in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'], // Remove specific console calls
      },
      format: {
        comments: false, // Remove comments
      },
    },

    // Source maps for production debugging (can disable for smaller builds)
    sourcemap: false,

    // Increase chunk size warning limit (TinyBase is ~150kb)
    chunkSizeWarningLimit: 600,
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
        // Cache game assets for offline play
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cloudinary-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        // Exclude analytics and tracking scripts from precache
        globIgnores: ['**/node_modules/**/*'],
        // Include game data files
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      includeAssets: ['./favicon.png'],
      devOptions: {
        enabled: false, // Disable in dev to avoid conflicts
        type: 'module',
      },
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
