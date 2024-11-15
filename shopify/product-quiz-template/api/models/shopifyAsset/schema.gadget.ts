import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyAsset" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Asset",
  fields: {},
  shopify: {
    fields: [
      "attachment",
      "checksum",
      "contentType",
      "key",
      "publicUrl",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "size",
      "theme",
    ],
  },
};
