import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {fileURLToPath} from "url";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      '/sphinx': {
        target: 'https://localhost:8443',
        changeOrigin: true,
        secure: false, // Set to false if using self-signed SSL certificate
      }
    }
  },
  
resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
