import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://customized-bundle-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-t429M3QqLoaG",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey:
        "ModelField-ItEQ_Ta3CU6u::FieldStorageEpoch-LzUSgOhWCQQ9",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
