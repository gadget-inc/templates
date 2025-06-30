import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "chat" model, go to https://chatgpt-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-sLCb3exJd_1e",
  fields: {
    messages: { type: "hasMany", children: { model: "message", belongsToField: "chat" }, storageKey: "ModelField-7w5w1uqDuoW8::FieldStorageEpoch-Ix4jayHAE3SU" },
    name: { type: "string", storageKey: "ModelField-tJgLPsH2hArj::FieldStorageEpoch-KNLbZ5YKogHz" },
    user: { type: "belongsTo", parent: { model: "user" }, storageKey: "ModelField-yoxP3_v2Iv-0::FieldStorageEpoch-4YtQwuF0LTXI" },
  },
};
