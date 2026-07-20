import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' so the built site works from any folder on static hosting
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
