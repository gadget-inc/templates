import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://product-reviews-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "efM7VD7hna5w",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "xDx19nBqoOKo",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
