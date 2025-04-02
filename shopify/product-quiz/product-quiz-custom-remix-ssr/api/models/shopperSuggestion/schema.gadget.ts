import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopperSuggestion" model, go to https://product-quiz-custom-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "ZhNI5rKg124n",
  fields: {
    product: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyProduct" },
      storageKey: "RSLopVRRACVV",
    },
    quizResult: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "quizResult" },
      storageKey: "7tHMl_TeTzGc",
    },
  },
};
