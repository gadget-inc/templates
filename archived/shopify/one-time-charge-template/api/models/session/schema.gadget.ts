import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://one-time-charge-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-ZLrzqzfM9QW_",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey:
        "ModelField-pEwla4F0824J::FieldStorageEpoch-0aQXbw1C89je",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
