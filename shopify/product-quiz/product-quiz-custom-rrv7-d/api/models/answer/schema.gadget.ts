import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "answer" model, go to https://product-quiz-custom-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "1mLmzFsL9Dvp",
  fields: {
    question: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "question" },
      storageKey: "jakOMWX6EY4F",
    },
    recommendedProduct: {
      type: "hasOne",
      child: {
        model: "recommendedProduct",
        belongsToField: "answer",
      },
      storageKey: "E_3qvwQpOV1f",
    },
    text: {
      type: "string",
      validations: { required: true },
      storageKey: "d79eu7Yd8q7v",
    },
  },
};
