import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "quizResult" model, go to https://product-quiz-custom-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "FJyqoTBm0NCk",
  fields: {
    email: { type: "email", storageKey: "QX0nTBNLaZpD" },
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
      storageKey: "RFOe0dKV4VTM",
    },
    quiz: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "quiz" },
      storageKey: "eY-Db59psvvq",
    },
  },
};
