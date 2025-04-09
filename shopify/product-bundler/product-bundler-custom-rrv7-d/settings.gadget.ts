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
          "read_products",
          "write_products",
          "write_cart_transforms",
          "read_cart_transforms",
          "write_publications",
          "read_publications",
        ],
      },
    },
  },
};
