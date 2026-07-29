import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 🚀 AJOUTEZ CE BLOC SERVER POUR LE PROXY
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // L'adresse de votre backend original
        changeOrigin: true,
        secure: false,
      },
    },
  },
})