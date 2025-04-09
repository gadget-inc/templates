import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://product-tagger-custom-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "LR76JFp80hAf",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "6GCRXb51O4px",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
