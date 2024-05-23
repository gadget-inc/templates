import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://product-tagger-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-aQztXkYKakCq",
  fields: { roles: { type: "roleList", default: ["unauthenticated"], storageKey: "ModelField-DzmD5PDItMna::FieldStorageEpoch-uVEZeiVx2UX4" } },
  shopify: { fields: ["shop", "shopifySID"] },
};
