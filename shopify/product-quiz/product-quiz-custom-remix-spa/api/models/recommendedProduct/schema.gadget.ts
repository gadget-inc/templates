import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "recommendedProduct" model, go to https://product-quiz-custom-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "mEwp9s32ujtC",
  fields: {
    answer: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "answer" },
      storageKey: "WaCEzlMVemXf",
    },
    productSuggestion: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyProduct" },
      storageKey: "e0DoJl9_FnQc",
    },
  },
};
