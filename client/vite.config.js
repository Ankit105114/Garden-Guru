import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory and its parent directories
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Base public path when served in production
    base: '/',
    // Development server configuration
    server: {
      port: 3000,
      proxy: {
        // Proxy API requests to the backend server
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['date-fns', 'lucide-react', 'react-calendar']
          }
        }
      }
    },
    // Environment variables
    define: {
      'process.env': {}
    },
    // Resolver configuration
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  };
});
