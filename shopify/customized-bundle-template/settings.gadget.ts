import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.3.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-07",
        enabledModels: [
          "shopifyProduct",
          "shopifyProductImage",
          "shopifyProductVariant",
        ],
        type: "partner",
        scopes: [
          "write_products",
          "read_products",
          "write_cart_transforms",
          "read_cart_transforms",
          "write_publications",
          "read_publications",
        ],
      },
    },
  },
};
