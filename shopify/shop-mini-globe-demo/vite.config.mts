import { defineConfig } from "vite";
import { gadget } from "gadget-server/vite";
import { reactRouter } from "@react-router/dev/vite";
import path from "path";

export default defineConfig({
  plugins: [gadget(), reactRouter()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./web"),
    },
  },
});