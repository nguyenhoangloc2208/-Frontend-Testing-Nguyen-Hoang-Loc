import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_SERVER_URL,
        changeOrigin: true,
        rewrite: (path) => {
          return path;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      include: ["src/**/*"],
    },
    setupFiles: ["src/test/setup.js"],
  },
});
