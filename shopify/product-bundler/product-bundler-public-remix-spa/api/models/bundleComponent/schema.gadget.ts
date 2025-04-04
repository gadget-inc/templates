import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundleComponent" model, go to https://product-bundler-public-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "ckbSmjbTXBKx",
  fields: {
    bundle: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "bundle" },
      storageKey: "1uRg0mCMU3HD",
    },
    productVariant: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyProductVariant" },
      storageKey: "iUqZUyoVY2yD",
    },
    quantity: {
      type: "number",
      default: 1,
      decimals: 0,
      validations: {
        required: true,
        numberRange: { min: 1, max: null },
      },
      storageKey: "aPnR2XwFvhkQ",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "CNCB7Sd0uZsj",
    },
  },
};
