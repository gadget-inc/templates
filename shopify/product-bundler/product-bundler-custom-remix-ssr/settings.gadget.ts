import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.3.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2025-04",
        enabledModels: [
          "shopifyFile",
          "shopifyProduct",
          "shopifyProductMedia",
          "shopifyProductVariant",
        ],
        type: "partner",
        scopes: [
          "write_cart_transforms",
          "write_products",
          "write_publications",
        ],
      },
    },
  },
};
