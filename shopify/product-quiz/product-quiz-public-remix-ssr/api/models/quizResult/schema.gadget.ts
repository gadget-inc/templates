import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "quizResult" model, go to https://product-quiz-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "hLmAjAS8Oi-G",
  fields: {
    email: { type: "email", storageKey: "h3Uec8C1dtW5" },
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
      storageKey: "FGOs2cxVHhja",
    },
    quiz: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "quiz" },
      storageKey: "QVzzukD3Kepw",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "0fg1ieKoXuXH",
    },
  },
};
