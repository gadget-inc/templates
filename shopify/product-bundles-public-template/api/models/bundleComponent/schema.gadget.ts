import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundleComponent" model, go to https://product-bundles-public-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "W9QwKNBDe215",
  fields: {
    bundleVariant: {
      type: "belongsTo",
      parent: { model: "shopifyProductVariant" },
      storageKey: "7eP4vZ9aylLl",
      searchIndex: false,
    },
    productVariant: {
      type: "belongsTo",
      parent: { model: "shopifyProductVariant" },
      storageKey: "7uvUGFvcYWcn",
      searchIndex: false,
    },
    quantity: {
      type: "number",
      storageKey: "JN4otVMSx7Ty",
      filterIndex: false,
      searchIndex: false,
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "lv3OJf5PvIoN",
      searchIndex: false,
    },
  },
  searchIndex: false,
};
