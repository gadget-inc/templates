import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.4.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2025-04",
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
          "write_products",
          "read_products",
          "write_metaobject_definitions",
          "read_metaobject_definitions",
          "write_metaobjects",
          "read_metaobjects",
        ],
      },
    },
  },
};
