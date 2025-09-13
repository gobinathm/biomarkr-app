import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Configure for client-side routing (SPA)
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  // Handle client-side routing in dev mode
  server: {
    historyApiFallback: true
  },
  // Handle client-side routing in preview mode
  preview: {
    historyApiFallback: true
  }
});
