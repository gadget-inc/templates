// ** IMPORTANT v1.2.0 upgrade change **
// You need to include the gadget plugin in your vite config:
//
// import react from "@vitejs/plugin-react-swc";
// import { defineConfig } from "vite";
// import { gadget } from "gadget-server/vite";
//
// export default defineConfig({
//   plugins: [gadget(), react()],
//   clearScreen: false,
// });
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { gadget } from "gadget-server/vite";

export default defineConfig({
  plugins: [gadget(), react()],
  clearScreen: false,
});

