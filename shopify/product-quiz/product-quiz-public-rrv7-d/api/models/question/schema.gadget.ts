import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "question" model, go to https://product-quiz-public-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "uU_VLHqB_rN3",
  fields: {
    answers: {
      type: "hasMany",
      children: { model: "answer", belongsToField: "question" },
      storageKey: "-A06t_yhYX2u",
    },
    quiz: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "quiz" },
      storageKey: "Ed81gGTJJOTM",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "JaMbDFM8uaB2",
    },
    text: {
      type: "string",
      validations: { required: true },
      storageKey: "4wXb9LRk4pWt",
    },
  },
};
