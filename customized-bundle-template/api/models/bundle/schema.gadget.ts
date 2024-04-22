import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundle" model, go to https://bundle-template.gadget.app/edit to view/edit your model in Gadget
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
  },
};
