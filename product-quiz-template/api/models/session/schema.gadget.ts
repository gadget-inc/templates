import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-QHHuZRn1vdwM",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey:
        "ModelField-zvroCvCM460X::FieldStorageEpoch-hAwSydTfzSrg",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
