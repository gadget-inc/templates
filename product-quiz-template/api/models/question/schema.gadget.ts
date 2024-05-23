import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "question" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-jLcFJnHdufY0",
  fields: {
    answers: {
      type: "hasMany",
      children: { model: "answer", belongsToField: "question" },
      storageKey:
        "ModelField-JLS6Gn0Z4XzY::FieldStorageEpoch-OnVlOwYzYS-d",
    },
    quiz: {
      type: "belongsTo",
      parent: { model: "quiz" },
      storageKey:
        "ModelField-ml9plTE5qQcg::FieldStorageEpoch-H9rzg6fz284X",
    },
    text: {
      type: "string",
      validations: { required: true },
      storageKey:
        "ModelField-IrDzOLWAwsiL::FieldStorageEpoch-CmifrrT2vEUL",
    },
  },
};
