import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load ALL env vars (not only VITE_) so we can support flexible naming
  const env = loadEnv(mode, process.cwd(), "");

  /**
   * ✅ IMPORTANT:
   * Set VITE_API_BASE_URL to your backend ORIGIN (NO trailing slash).
   * Examples:
   *  - http://localhost:3001
   *  - https://pacificengineering-backend.onrender.com
   */
  const apiTarget =
    env.VITE_API_BASE_URL ||
    env.API_BASE_URL ||
    "http://localhost:3001";

  return {
    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),

        // These prevent the “Failed to resolve import @components/...” class of errors
        "@api": path.resolve(__dirname, "./src/api"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@layouts": path.resolve(__dirname, "./src/layouts"),
        "@router": path.resolve(__dirname, "./src/router"),
        "@context": path.resolve(__dirname, "./src/context"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },

    /**
     * ✅ DEV API PROXY:
     * Any frontend call to /api/... will be forwarded to your backend.
     * This fixes the:
     *   "Unexpected token '<' ... not valid JSON"
     * error that happens when Vite serves index.html for /api requests.
     */
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      chunkSizeWarningLimit: 1600,
      cssMinify: "esbuild",
      cssCodeSplit: true,

      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            radix: [
              "@radix-ui/react-accordion",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-hover-card",
              "@radix-ui/react-dialog",
              "@radix-ui/react-select",
              "@radix-ui/react-tabs",
              "@radix-ui/react-toast",
            ],
            editor: [
              "react-quill",
              "html2canvas",
              "jspdf",
              "dompurify",
              "turndown",
            ],
            dragdrop: ["@hello-pangea/dnd"],
            pdf: ["docx", "mammoth"],
            charts: ["recharts"],
          },
        },
      },
    },
  };
});
