import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.3.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-10",
        enabledModels: [
          "shopifyOrder",
          "shopifyOrderTransaction",
          "shopifyRefund",
        ],
        type: "partner",
        scopes: ["read_orders"],
      },
    },
  },
};
