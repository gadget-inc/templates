import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopperSuggestion" model, go to https://product-quiz-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "8awBgCs30Hau",
  fields: {
    product: {
      type: "belongsTo",
      parent: { model: "shopifyProduct" },
      storageKey: "wh13PlNOHbGg",
    },
    quizResult: {
      type: "belongsTo",
      parent: { model: "quizResult" },
      storageKey: "zZYYO4u6KjM8",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "P5f3wseFf4-n",
    },
  },
};
