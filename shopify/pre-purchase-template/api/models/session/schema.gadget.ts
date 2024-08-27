import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://pre-purchase-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-8tMACfF-Gwpm",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey:
        "ModelField-lYsafzXBNx_g::FieldStorageEpoch-LYWwW6j0dnKG",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
