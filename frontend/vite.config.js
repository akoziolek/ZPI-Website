import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // for hot reloads in docker env
  server: {
    host: true,
    // allow cross-origin requests from other containers (Cypress)
    cors: true,
    // explicitly set HMR host when accessed via service name inside docker
    hmr: {
      host: 'zpi.local',
      // host: process.env.VITE_HMR_HOST || 'frontend',
      protocol: 'ws',
      clientPort: Number(process.env.VITE_HMR_CLIENT_PORT) || 5173
    },
    watch: {
      usePolling: true,
      interval: 100
    },
    allowedHosts: ['zpi.local']
  }
})
