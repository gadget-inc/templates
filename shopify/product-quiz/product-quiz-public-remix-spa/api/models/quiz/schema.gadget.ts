import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "quiz" model, go to https://product-quiz-public-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "3T6UB25tCQgG",
  fields: {
    body: { type: "string", storageKey: "JBLxu2M6Z69e" },
    questions: {
      type: "hasMany",
      children: { model: "question", belongsToField: "quiz" },
      storageKey: "IsGzERXHT5lE",
    },
    results: {
      type: "hasMany",
      children: { model: "quizResult", belongsToField: "quiz" },
      storageKey: "Fppjo4S5zGTL",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "xAPuaVDwup04",
    },
    slug: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "GXoUOYZapLfE",
    },
    title: {
      type: "string",
      validations: { required: true },
      storageKey: "MrkUx8P_aC_m",
    },
  },
};
