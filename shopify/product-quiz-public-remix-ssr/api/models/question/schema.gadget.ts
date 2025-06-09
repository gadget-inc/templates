import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "question" model, go to https://product-quiz-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "TPV2gYlkfsrQ",
  fields: {
    answers: {
      type: "hasMany",
      children: { model: "answer", belongsToField: "question" },
      storageKey: "k15JNG5mrdJ3",
    },
    quiz: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "quiz" },
      storageKey: "6Qn6GRL3Y5Fq",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "mXBSgBZFKi_9",
    },
    text: {
      type: "string",
      validations: { required: true },
      storageKey: "279NFjy9UGQr",
    },
  },
};
