import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['d3'],
          ui: ['framer-motion', 'lucide-react'],
          pinecone: ['@pinecone-database/pinecone']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
