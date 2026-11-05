import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress module-level directive warnings coming from framer-motion
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message.includes('framer-motion')
        ) {
          return;
        }
        warn(warning);
      }
    }
  }
});
