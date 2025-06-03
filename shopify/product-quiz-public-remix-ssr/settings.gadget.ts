import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.4.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2025-04",
        enabledModels: [
          "shopifyFile",
          "shopifyProduct",
          "shopifyProductMedia",
        ],
        type: "partner",
        scopes: ["read_products", "read_themes"],
      },
    },
  },
};
