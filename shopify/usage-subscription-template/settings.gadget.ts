import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.1.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-07",
        enabledModels: ["shopifyAppSubscription", "shopifyOrder"],
        type: "partner",
        scopes: ["read_products", "read_orders"],
      },
    },
  },
};
