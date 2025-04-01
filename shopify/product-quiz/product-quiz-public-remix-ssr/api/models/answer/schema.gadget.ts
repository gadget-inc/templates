import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "answer" model, go to https://product-quiz-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "qlve66Jd_jnf",
  fields: {
    question: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "question" },
      storageKey: "7ICaN0ZEOB9B",
    },
    recommendedProduct: {
      type: "hasOne",
      child: {
        model: "recommendedProduct",
        belongsToField: "answer",
      },
      storageKey: "7iINZabuy2yQ",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "mPiUTPyqfR_K",
    },
    text: {
      type: "string",
      validations: { required: true },
      storageKey: "1tSCl4CUYwdx",
    },
  },
};
