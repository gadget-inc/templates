import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "message" model, go to https://chatgpt-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-vCTnwncGuD9F",
  fields: {
    chat: { type: "belongsTo", parent: { model: "chat" }, storageKey: "ModelField-0I5nrbWHEl5S::FieldStorageEpoch-b3Io6gIasWVj" },
    content: { type: "string", validations: { required: true }, storageKey: "ModelField-CiWWPGzS0QAc::FieldStorageEpoch--EHF_9THGeIe" },
    order: { type: "number", validations: { required: true, unique: { scopeByField: "chat" } }, storageKey: "ModelField-hOCk3A0kuG3Z::FieldStorageEpoch-KteFCS9uScXo" },
    role: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["system", "user", "assistant"],
      validations: { required: true },
      storageKey: "ModelField-kA-Y7ovlYM3h::FieldStorageEpoch-zUxvgMdsNIyy",
    },
  },
};
