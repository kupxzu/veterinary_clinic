import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.png'],
      manifest: {
        name: 'VetClinic Pro - Veterinary Management System',
        short_name: 'VetClinic Pro',
        description: 'Complete veterinary clinic management application with patient records, appointments, and staff management',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/?source=pwa',
        id: 'vetclinic-pro',
        categories: ['medical', 'business', 'productivity'],
        lang: 'en',
        dir: 'ltr',
        launch_handler: {
          client_mode: 'navigate-existing'
        },
        protocol_handlers: [
          {
            protocol: 'web+vetclinic',
            url: '/?action=%s'
          }
        ],
        file_handlers: [
          {
            action: '/file-handler',
            accept: {
              'text/csv': ['.csv'],
              'application/pdf': ['.pdf']
            }
          }
        ],
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'View clinic dashboard',
            url: '/dashboard?source=shortcut',
            icons: [{ src: 'logo.png', sizes: '192x192' }]
          },
          {
            name: 'Patients',
            short_name: 'Patients',
            description: 'Manage patient records',
            url: '/patients?source=shortcut',
            icons: [{ src: 'logo.png', sizes: '192x192' }]
          },
          {
            name: 'Appointments',
            short_name: 'Appointments',
            description: 'Schedule and manage appointments',
            url: '/appointments?source=shortcut',
            icons: [{ src: 'logo.png', sizes: '192x192' }]
          },
          {
            name: 'Quick Add Patient',
            short_name: 'Add Patient',
            description: 'Quickly add a new patient',
            url: '/patients/new?source=shortcut',
            icons: [{ src: 'logo.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
})
