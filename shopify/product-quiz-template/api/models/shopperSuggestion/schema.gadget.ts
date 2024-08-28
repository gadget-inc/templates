import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopperSuggestion" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-E564EnYOa2mt",
  fields: {
    product: {
      type: "belongsTo",
      parent: { model: "shopifyProduct" },
      storageKey:
        "ModelField-aRhdxG-w4WFz::FieldStorageEpoch-8xNJjE0f-qgj",
    },
    quizResult: {
      type: "belongsTo",
      parent: { model: "quizResult" },
      storageKey:
        "ModelField-nbTseTVrTZyR::FieldStorageEpoch-egFQfKBy0KVb",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "MrIZTzMqNc_t",
    },
  },
};
