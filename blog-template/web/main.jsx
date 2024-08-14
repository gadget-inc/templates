import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("#root element not found for booting react app");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ChakraProvider>
      <AppProvider i18n={enTranslations}>
        <App />
      </AppProvider>
    </ChakraProvider>
  </React.StrictMode>
);
