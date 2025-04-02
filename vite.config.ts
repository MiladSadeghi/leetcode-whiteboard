import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import string from "vite-plugin-string";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    string({
      include: ["**/*.css"],
    }),
  ],
  build: {
    rollupOptions: {
      input: "src/main.tsx",
      output: {
        entryFileNames: "assets/index.js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return `assets/index.css`;
          }
          return `[name].[ext]`;
        },
      },
    },
  },
});
