import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      onwarn(warning, warn) {
        // React libraries (react-bootstrap, framer-motion, ...) ship "use client"
        // directives. They are irrelevant in this client-only Vite app.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        // lottie-web (dependency) uses eval internally; ignore dependency-only eval warnings.
        if (
          warning.code === 'EVAL' &&
          typeof warning.id === 'string' &&
          warning.id.includes('node_modules')
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
