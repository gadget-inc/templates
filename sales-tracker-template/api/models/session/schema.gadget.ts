import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://sales-tracker-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-RdfOGBA2v2te",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey:
        "ModelField-XAoem7Z556jq::FieldStorageEpoch-ej4G1abetb4s",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
