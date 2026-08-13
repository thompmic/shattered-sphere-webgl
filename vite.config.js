import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Vite does not open a browser on its own — it prints the URL and waits, which
    // reads as "nothing happened". Open it so `npm run dev` actually launches the site.
    open: true,
    // if 5173 is taken (a stray dev server from an earlier run), move to the next free
    // port rather than exiting with an error
    strictPort: false,
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
        },
      },
    },
  },
})
