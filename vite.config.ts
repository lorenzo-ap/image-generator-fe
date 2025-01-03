import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.VITE_X_RAPIDAPI_KEY': JSON.stringify(process.env.VITE_X_RAPIDAPI_KEY)
  }
});
