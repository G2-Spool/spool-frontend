import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          amplify: ['aws-amplify', '@aws-amplify/ui-react'],
          charts: ['d3'],
          ui: ['framer-motion', 'lucide-react'],
          pinecone: ['@pinecone-database/pinecone']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
