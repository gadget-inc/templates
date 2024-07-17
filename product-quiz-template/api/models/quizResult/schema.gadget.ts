import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "quizResult" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-vkm9x9eUeVsn",
  fields: {
    email: {
      type: "email",
      storageKey:
        "ModelField-HWE6Aw6qqN01::FieldStorageEpoch-JmqCVnISzV1b",
    },
    quiz: {
      type: "belongsTo",
      parent: { model: "quiz" },
      storageKey:
        "ModelField-ottN9on242Dv::FieldStorageEpoch-Nl5M9EQfgf2r",
    },
    shopperSuggestion: {
      type: "hasManyThrough",
      sibling: {
        model: "shopifyProduct",
        relatedField: "shopperSuggestion",
      },
      join: {
        model: "shopperSuggestion",
        belongsToSelfField: "quizResult",
        belongsToSiblingField: "product",
      },
      storageKey:
        "ModelField-K6DiL3yeGt1q::FieldStorageEpoch-ILQMDXozMyYj",
    },
  },
};
