import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundle" model, go to https://customized-bundle-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "ZzZwQ9y4-thr",
  fields: {
    bundleComponents: {
      type: "hasManyThrough",
      sibling: {
        model: "shopifyProductVariant",
        relatedField: "bundleComponents",
      },
      join: {
        model: "bundleComponent",
        belongsToSelfField: "bundle",
        belongsToSiblingField: "variant",
      },
      storageKey: "dSB_evcwPCtS",
    },
    bundleVariant: {
      type: "belongsTo",
      parent: { model: "shopifyProductVariant" },
      storageKey: "nCho86f45q8o",
    },
    description: { type: "string", storageKey: "rXyzN2mr5Sm7" },
    price: {
      type: "number",
      validations: { numberRange: { min: 0, max: null } },
      storageKey: "zCSKCmHj0e79",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "4UnjMdSSf0na",
    },
    status: {
      type: "enum",
      default: "active",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["active", "archived", "draft"],
      storageKey: "oluQn15WMTaa",
    },
    title: { type: "string", storageKey: "NzJl8zUoaFJF" },
  },
};
