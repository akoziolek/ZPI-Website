import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,           // pozwala kontenerom na połączenie przez nazwę serwisu
    hmr: true,           // wyłącz HMR dla testów Cypress
    cors: true,
    allowedHosts: [
      'localhost',        // Dodaj konkretnie ten host
      'frontend',         // Nazwa serwisu w dockerze
    ],
    
    watch: {
      usePolling: true,
      interval: 100
    }
  }
})
