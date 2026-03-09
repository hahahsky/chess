import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  main: {
    build: {
      outDir: resolve(__dirname, "dist/main")
    }
  },
  preload: {
    build: {
      outDir: resolve(__dirname, "dist/preload")
    }
  },
  renderer: {
    root: "src/renderer",
    build: {
      outDir: resolve(__dirname, "dist/renderer")
    },
    plugins: [react()]
  }
});
