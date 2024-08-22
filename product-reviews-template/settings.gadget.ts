import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.1.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-07",
        enabledModels: [
          "shopifyCustomer",
          "shopifyOrder",
          "shopifyOrderLineItem",
          "shopifyProduct",
          "shopifyProductImage",
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
