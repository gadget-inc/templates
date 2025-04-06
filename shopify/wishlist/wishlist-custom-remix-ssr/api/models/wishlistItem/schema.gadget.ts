import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "wishlistItem" model, go to https://wishlist-custom-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "ASV7zGTbSoqg",
  fields: {
    bought: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey: "g_X7udz6qIRF",
    },
    customer: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyCustomer" },
      storageKey: "4AXIC9BC4aen",
    },
    variant: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyProductVariant" },
      storageKey: "2NWy9PBWY4XO",
    },
    wishlist: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "wishlist" },
      storageKey: "ATYVIGLj_-iC",
    },
  },
};
