import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "recommendedProduct" model, go to https://product-quiz-custom-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "VwSKfgQuotnU",
  fields: {
    answer: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "answer" },
      storageKey: "vOfRNbvPdNIz",
    },
    productSuggestion: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyProduct" },
      storageKey: "00Vzv_TxI_wm",
    },
  },
};
