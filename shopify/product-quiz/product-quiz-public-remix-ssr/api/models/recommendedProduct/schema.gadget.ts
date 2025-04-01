import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "recommendedProduct" model, go to https://product-quiz-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "BhF4f_nhvUG3",
  fields: {
    answer: {
      type: "belongsTo",
      parent: { model: "answer" },
      storageKey: "X8nQFPjJtDbG",
    },
    productSuggestion: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyProduct" },
      storageKey: "QapJkXi8PURA",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "mdtl6TUNN3T9",
    },
  },
};
