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
          "shopifyOrder",
          "shopifyProduct",
        ],
        type: "partner",
        scopes: [
          "write_products",
          "read_products",
          "read_orders",
          "read_customers",
        ],
      },
    },
  },
};
