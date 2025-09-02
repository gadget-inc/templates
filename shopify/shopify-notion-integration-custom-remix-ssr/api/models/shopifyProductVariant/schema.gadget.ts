import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProductVariant" model, go to https://finance-dashboard-app.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-ProductVariant",
  fields: {},
  shopify: {
    fields: [
      "barcode",
      "compareAtPrice",
      "inventoryItem",
      "inventoryPolicy",
      "inventoryQuantity",
      "option1",
      "option2",
      "option3",
      "orderLineItems",
      "position",
      "price",
      "product",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "sku",
      "taxable",
      "title",
    ],
  },
};
