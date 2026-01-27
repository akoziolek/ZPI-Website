import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,      
    hmr: true,    
    cors: true,
    allowedHosts: [
      'localhost',     
      'frontend',    
    ],
    
    watch: {
      usePolling: true,
      interval: 100
    }
  }
})
