import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/senior_officer_2026/',
  build: {
    outDir: 'dist',
  }
})
