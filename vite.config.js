import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
  },
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@mui/x-data-grid")) return "mui-data-grid";
          if (id.includes("recharts")) return "recharts";
          if (id.includes("@tanstack/react-query")) return "tanstack-query";
          if (id.includes("react-router")) return "router";
          if (id.includes("@mui/")) return "mui";
          // Do not split react / react-dom / @emotion into separate manual chunks:
          // that can load two copies and break hooks + Emotion singleton.
        },
      },
    },
  },
  server: {
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
}));
