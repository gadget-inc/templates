import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopperSuggestion" model, go to https://product-quiz-public-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "n9f1QAgNNUpx",
  fields: {
    product: {
      type: "belongsTo",
      parent: { model: "shopifyProduct" },
      storageKey: "GmXGFkgT2Z4A",
    },
    quizResult: {
      type: "belongsTo",
      parent: { model: "quizResult" },
      storageKey: "1_0pYmyXGw2e",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "q5id8AXqZYzL",
    },
  },
};
