import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundleComponent" model, go to https://product-bundler-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "YQ6xrn77bw7Y",
  fields: {
    bundle: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "bundle" },
      storageKey: "RRC5VYGhChi3",
    },
    productVariant: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyProductVariant" },
      storageKey: "jbIyYSZDwuND",
    },
    quantity: {
      type: "number",
      default: 1,
      decimals: 0,
      validations: {
        required: true,
        numberRange: { min: 1, max: null },
      },
      storageKey: "bmyOMHqySqTk",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "m3soYKW8JcFG",
    },
  },
};
