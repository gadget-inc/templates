import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://tailwind-css-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-3CEZi4J6SK3s",
  fields: { user: { type: "belongsTo", parent: { model: "user" }, storageKey: "ModelField-GIgp69keUKay::FieldStorageEpoch-sQBiQMaAFdL-" } },
};
