import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://ai-screenwriter-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-9OKE1dvrtt3U",
  fields: {
    roles: { type: "roleList", default: ["unauthenticated"], storageKey: "ModelField-onOZKez3R429::FieldStorageEpoch-319eEk33rwXy" },
    user: { type: "belongsTo", parent: { model: "user" }, storageKey: "ModelField-JIeBDfw5k9KS::FieldStorageEpoch-6-7lpTJlKEbI" },
  },
};
