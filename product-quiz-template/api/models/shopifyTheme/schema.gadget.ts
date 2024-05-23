import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyTheme" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Theme",
  fields: {
    usingOnlineStore2: {
      type: "boolean",
      default: false,
      storageKey:
        "ModelField-qlay0qHzaEp2::FieldStorageEpoch-AibujPwLX2oh",
    },
  },
  shopify: {
    fields: [
      "assets",
      "name",
      "previewable",
      "processing",
      "role",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "themeStoreId",
    ],
  },
};
