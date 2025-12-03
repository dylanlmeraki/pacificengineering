import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600, // silence large warnings
    cssMinify: "esbuild",
    cssCodeSplit: true,

    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": [
            "react",
            "react-dom",
            "react-router-dom",
          ],
          "radix": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
          ],
          "editor": [
            "react-quill",
            "html2canvas",
            "jspdf",
            "dompurify",
            "turndown",
          ],
          "dragdrop": ["@hello-pangea/dnd"],
          "pdf": ["docx", "mammoth"],
          "charts": ["recharts"],
        },
      },
    },
  },
});
