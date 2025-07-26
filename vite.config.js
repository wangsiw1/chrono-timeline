
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: "/chrono-timeline/",
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Chrono Timeline PWA',
        short_name: 'Chrono Timeline',
        start_url: '/chrono-timeline/',
        scope: '/chrono-timeline/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#242424',
        icons: [
          {
            src: '/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
});
