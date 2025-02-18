import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.3.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2025-01",
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
          "write_products",
          "read_products",
          "read_orders",
          "read_customers",
          "write_metaobject_definitions",
          "read_metaobject_definitions",
          "write_metaobjects",
          "read_metaobjects",
        ],
      },
    },
  },
};
