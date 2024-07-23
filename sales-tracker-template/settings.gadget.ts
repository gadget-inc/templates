import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.1.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2023-10",
        enabledModels: ["shopifyOrder", "shopifyOrderTransaction"],
        type: "partner",
        scopes: ["read_orders"],
      },
    },
  },
};
