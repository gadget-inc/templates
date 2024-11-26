import { AppProvider } from "@shopify/polaris";
import { PolarisVizProvider } from "@shopify/polaris-viz";
import "@shopify/polaris/build/esm/styles.css";
import "@shopify/polaris-viz/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";

const root = document.getElementById("root");
if (!root) throw new Error("#root element not found for booting react app");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AppProvider i18n={enTranslations}>
      <PolarisVizProvider
        //  Styles for the Shopify Polaris Viz BarChart component
        themes={{
          Default: {
            chartContainer: {
              borderRadius: "8px",
              padding: "20px",
              minHeight: 240,
            },
            grid: {
              showHorizontalLines: true,
              verticalOverflow: false,
            },
            xAxis: {
              hide: true,
            },
            seriesColors: {
              limited: ["#7CB342", "#478CDC"],
            },
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PolarisVizProvider>
    </AppProvider>
  </React.StrictMode>
);
