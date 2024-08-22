import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://chatsphere-7tox.onrender.com',
        secure: true,
      },
    },
  },
  resolve: {
    alias: {
      //eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
