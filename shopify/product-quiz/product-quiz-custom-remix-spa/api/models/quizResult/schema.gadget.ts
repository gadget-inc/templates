import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "quizResult" model, go to https://product-quiz-custom-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "pyKG9S-m4B91",
  fields: {
    email: { type: "string", storageKey: "i5tvzeCZUmvk" },
    products: {
      type: "hasManyThrough",
      sibling: {
        model: "shopifyProduct",
        relatedField: "quizResults",
      },
      join: {
        model: "shopperSuggestion",
        belongsToSelfField: "quizResult",
        belongsToSiblingField: "product",
      },
      storageKey: "Fdo8uxpCCyS_",
    },
    quiz: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "quiz" },
      storageKey: "32VMNkU1JrFI",
    },
  },
};
