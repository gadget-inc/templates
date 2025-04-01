import { defineConfig } from "vite";
import { gadget } from "gadget-server/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [gadget(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./web"),
    },
  },
});