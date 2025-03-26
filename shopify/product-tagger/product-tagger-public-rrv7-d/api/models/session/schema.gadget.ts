import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://product-tagger-public-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "7rHnFdirDck1",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "3uJJxwmY3a0-",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
