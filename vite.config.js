import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  include: ['three'],
  server: {
    hmr: {
      // Fix for message port closed error
      overlay: false,
      // Try connecting via different protocols
      protocol: 'ws',
      host: 'localhost',
    },
    watch: {
      // Increase debounce interval to reduce frequency of HMR updates
      usePolling: true,
      interval: 1000,
    }
  }
})
