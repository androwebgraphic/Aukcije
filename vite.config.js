import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    // lottie-web is isolated in its own lazy chunk (~540 kB); it is needed only
    // on pages with Lottie animations, so a slightly higher limit is acceptable.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "lottie",
              test: /node_modules[\\/](lottie-web|@lottiefiles|@lordicon)[\\/]/,
              minSize: 0,
            },
          ],
        },
      },
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
