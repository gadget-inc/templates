import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "quizResult" model, go to https://product-quiz-custom-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "fQeUy1OT1mK2",
  fields: {
    email: { type: "email", storageKey: "xpf7c9NLwOg6" },
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
      storageKey: "BQ-ZR4mcliuz",
    },
    quiz: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "quiz" },
      storageKey: "Q9jQ1uAKXPfW",
    },
  },
};
