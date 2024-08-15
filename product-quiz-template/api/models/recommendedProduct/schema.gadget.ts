import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "recommendedProduct" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-ges6ZEHDdYId",
  fields: {
    answer: {
      type: "belongsTo",
      parent: { model: "answer" },
      storageKey:
        "ModelField--4uhhyDt7Bfa::FieldStorageEpoch-rW_2uvro7fEA",
    },
    productSuggestion: {
      type: "belongsTo",
      parent: { model: "shopifyProduct" },
      storageKey:
        "ModelField-G2xNtAz-AZj4::FieldStorageEpoch-SYJoUC0ldSDE",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "i0atTGj9Ehw_",
    },
  },
};
