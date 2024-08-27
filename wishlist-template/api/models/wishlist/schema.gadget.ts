import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "wishlist" model, go to https://wishlist-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "I-kA_lPJnBFf",
  fields: {
    customer: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyCustomer" },
      storageKey: "fTJ1XCm3x37b",
    },
    image: {
      type: "file",
      allowPublicAccess: false,
      storageKey: "ciPsdGciGbo1",
    },
    itemCount: {
      type: "computed",
      sourceFile: "api/models/wishlist/itemCount.gelly",
      storageKey: "mhJ6sSpi-wyS",
    },
    name: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "customer" },
      },
      storageKey: "Ch3SSNcG-CdG",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "2FZjX5fACwrm",
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
