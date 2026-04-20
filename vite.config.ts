import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isDev = process.env.NODE_ENV === 'development'
const apiTarget = process.env.VITE_API_URL || 'http://127.0.0.1:4000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: isDev ? {
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  } : undefined,
})
