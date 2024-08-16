import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "answer" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-jsx-L0d72nP0",
  fields: {
    question: {
      type: "belongsTo",
      parent: { model: "question" },
      storageKey:
        "ModelField-8mR1it2vmoiv::FieldStorageEpoch-9HmFfIxygJUB",
    },
    recommendedProduct: {
      type: "hasOne",
      child: {
        model: "recommendedProduct",
        belongsToField: "answer",
      },
      storageKey:
        "ModelField-cRu6v7hxn2Ny::FieldStorageEpoch-ZJwyTr1ZB6at",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "MZSWeJSRMvCV",
    },
    text: {
      type: "string",
      validations: { required: true },
      storageKey:
        "ModelField-ff5zL70uZwWi::FieldStorageEpoch-oUfCPEIhQLN0",
    },
  },
};
