import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './', // Use relative paths for shared hosting
  build: {
    outDir: 'build', // Use different output directory
  },
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
