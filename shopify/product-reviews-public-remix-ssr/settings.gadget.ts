import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.4.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2025-07",
        enabledModels: [
          "shopifyCustomer",
          "shopifyFile",
          "shopifyOrder",
          "shopifyOrderLineItem",
          "shopifyProduct",
          "shopifyProductMedia",
        ],
        type: "partner",
        scopes: [
          "read_customers",
          "read_orders",
          "write_metaobject_definitions",
          "write_metaobjects",
          "write_products",
          "read_themes",
        ],
      },
    },
  },
};
