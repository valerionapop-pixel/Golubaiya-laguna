import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "gallery-src/entry.tsx"),
      name: "LagunaGallery3D",
      formats: ["es"],
      fileName: "gallery-3d",
    },
    outDir: "dist-gallery",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },
});
