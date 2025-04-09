import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "question" model, go to https://product-quiz-public-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "qdgNlznaKB09",
  fields: {
    answers: {
      type: "hasMany",
      children: { model: "answer", belongsToField: "question" },
      storageKey: "WEO7SOmItB7u",
    },
    quiz: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "quiz" },
      storageKey: "r_nrF5xTrYgb",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "IKCp3lRfopB1",
    },
    text: {
      type: "string",
      validations: { required: true },
      storageKey: "9mTq_S1ByD_N",
    },
  },
};
