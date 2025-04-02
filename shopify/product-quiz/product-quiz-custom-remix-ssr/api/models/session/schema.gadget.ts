import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://product-quiz-custom-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "025ZkCv4rUn8",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "90A-W3DgwXzr",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
