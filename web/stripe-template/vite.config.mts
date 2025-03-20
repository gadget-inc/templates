import path from "path";
import { reactRouter } from "@react-router/dev/vite";
import { gadget } from "gadget-server/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [gadget(), reactRouter()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./web"),
    },
  },
});
