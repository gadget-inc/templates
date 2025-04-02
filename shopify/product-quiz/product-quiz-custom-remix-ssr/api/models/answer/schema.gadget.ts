import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "answer" model, go to https://product-quiz-custom-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "UyS0BUmzfWEE",
  fields: {
    question: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "question" },
      storageKey: "rtSMYj5vyRgw",
    },
    recommendedProduct: {
      type: "hasOne",
      child: {
        model: "recommendedProduct",
        belongsToField: "answer",
      },
      storageKey: "gNob39q2jFIr",
    },
    text: {
      type: "string",
      validations: { required: true },
      storageKey: "LG-igzTJp-9H",
    },
  },
};
