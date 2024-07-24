import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "wishlist" model, go to https://wishlist-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "I-kA_lPJnBFf",
  fields: {
    customer: {
      type: "belongsTo",
      parent: { model: "shopifyCustomer" },
      storageKey: "ILx3RJJ8XXpt",
    },
    variants: {
      type: "hasManyThrough",
      sibling: {
        model: "shopifyProductVariant",
        relatedField: "wishlists",
      },
      join: {
        model: "wishlistItem",
        belongsToSelfField: "wishlist",
        belongsToSiblingField: "variant",
      },
      storageKey: "-9gTk6wG3FZD",
    },
  },
};
