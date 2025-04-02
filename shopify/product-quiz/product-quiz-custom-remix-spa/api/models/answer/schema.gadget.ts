import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "answer" model, go to https://product-quiz-custom-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "_gs6TW0KoHen",
  fields: {
    question: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "question" },
      storageKey: "lQ43x4sddh88",
    },
    recommendedProduct: {
      type: "hasOne",
      child: {
        model: "recommendedProduct",
        belongsToField: "answer",
      },
      storageKey: "QDEkP5_k_q6p",
    },
    text: {
      type: "string",
      validations: { required: true },
      storageKey: "Gn4e-BVBVo-i",
    },
  },
};
