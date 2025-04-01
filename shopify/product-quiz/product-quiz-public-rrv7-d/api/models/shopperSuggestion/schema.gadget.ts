import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopperSuggestion" model, go to https://product-quiz-public-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "r4_-3vIhvzgz",
  fields: {
    product: {
      type: "belongsTo",
      parent: { model: "shopifyProduct" },
      storageKey: "v-Sb5Wn_-R8d",
    },
    quizResult: {
      type: "belongsTo",
      parent: { model: "quizResult" },
      storageKey: "Hr-g02h3NtO0",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "LtYTf4EiV4w-",
    },
  },
};
