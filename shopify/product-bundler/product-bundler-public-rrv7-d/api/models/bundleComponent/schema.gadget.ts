import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundleComponent" model, go to https://product-bundler-public-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "gPvTgiiFY6ws",
  fields: {
    bundle: {
      type: "belongsTo",
      parent: { model: "bundle" },
      storageKey: "6GXOwqQwK8xi",
    },
    productVariant: {
      type: "belongsTo",
      parent: { model: "shopifyProductVariant" },
      storageKey: "dxZNvtBp0Oir",
    },
    quantity: {
      type: "number",
      default: 1,
      decimals: 0,
      validations: {
        required: true,
        numberRange: { min: 1, max: null },
      },
      storageKey: "xhb32YjZ6lPw",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "megzZ1I5gt6B",
    },
  },
};
