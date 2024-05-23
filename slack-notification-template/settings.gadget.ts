import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.0.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-01",
        enabledModels: [
          "shopifyCustomer",
          "shopifyOrder",
          "shopifyOrderTransaction",
        ],
        type: "partner",
        scopes: ["read_orders", "read_customers"],
      },
    },
  },
};
