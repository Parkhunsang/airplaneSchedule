import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor'
          }

          if (id.includes('firebase')) {
            return 'firebase-vendor'
          }

          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'i18n-vendor'
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
})
