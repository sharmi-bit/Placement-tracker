import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite configuration for the Placement Tracker frontend.
// The @tailwindcss/vite plugin handles Tailwind CSS v4 — no separate
// tailwind.config.js / postcss.config.js files are needed for v4.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
})
