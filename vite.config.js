// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1. Increase the warning limit so Vite doesn't complain about 500kb chunks
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        // 2. The "Scissors": This logic cuts your bundle into pieces
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // A. Keep React separate (It rarely changes, so users cache it forever)
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            // B. Put all other libraries (like Icons, Analytics) in a separate file
            return 'vendor-libs';
          }
        },
      },
    },
  },
});