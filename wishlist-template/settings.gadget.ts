import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.2.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-07",
        enabledModels: [
          "shopifyCustomer",
          "shopifyInventoryItem",
          "shopifyInventoryLevel",
          "shopifyLocation",
          "shopifyProduct",
          "shopifyProductImage",
          "shopifyProductVariant",
        ],
        type: "partner",
        scopes: [
          "read_products",
          "read_inventory",
          "read_locations",
          "read_customers",
        ],
      },
    },
  },
};
