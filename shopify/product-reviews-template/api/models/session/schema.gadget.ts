import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://product-reviews-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "KhzynW8lzIdN",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "3GhoUYEo3Lq4",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
