import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "quiz" model, go to https://product-quiz-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "29eEBxUAUqzi",
  fields: {
    description: {
      type: "string",
      default: "No description provided",
      storageKey: "XNASbnhaoKp0",
    },
    questions: {
      type: "hasMany",
      children: { model: "question", belongsToField: "quiz" },
      storageKey: "CBR4lvc1pfMQ",
    },
    results: {
      type: "hasMany",
      children: { model: "quizResult", belongsToField: "quiz" },
      storageKey: "SHoNQgYEfGmm",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "J06xiFoqVpfy",
    },
    slug: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "r4Wm0DTObItZ",
    },
    title: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "3OaUW1U2xinr",
    },
  },
};
