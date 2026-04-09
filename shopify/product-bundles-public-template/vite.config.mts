import { defineConfig } from "vite";
import { gadget } from "gadget-server/vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [gadget(), reactRouter()],
});