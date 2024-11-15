import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProductImage" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-ProductImage",
  fields: {},
  shopify: {
    fields: [
      "alt",
      "height",
      "position",
      "product",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "source",
      "width",
    ],
  },
};
