import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: 'unity', // If your Unity build is inside the "unity" folder

  // Optionally, configure the assetsInclude for specific file types
  assetsInclude: ['**/*.json', '**/*.wasm', '**/*.js', '**/*.data'],
})
