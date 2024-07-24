import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "wishlistItem" model, go to https://wishlist-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "5rOsuM8hKAvu",
  fields: {
    variant: {
      type: "belongsTo",
      parent: { model: "shopifyProductVariant" },
      storageKey: "2lay6D7OSivN",
    },
    wishlist: {
      type: "belongsTo",
      parent: { model: "wishlist" },
      storageKey: "foqv63E5mM9_",
    },
  },
};
