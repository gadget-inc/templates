import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "wishlist" model, go to https://wishlist-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "rGieoDninNGp",
  fields: {
    customer: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyCustomer" },
      storageKey: "_y3kjBHYITul",
    },
    image: {
      type: "file",
      allowPublicAccess: false,
      storageKey: "FyDFE7rjgXJQ",
    },
    itemCount: {
      type: "computed",
      sourceFile: "api/models/wishlist/itemCount.gelly",
      storageKey: "6UpGQeq_3Xpf",
    },
    name: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "customer" },
      },
      storageKey: "PxcGfnMO3EKO",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "R03xJchZE9ZU",
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
      storageKey: "Iyqne7OphCE9",
    },
  },
};
