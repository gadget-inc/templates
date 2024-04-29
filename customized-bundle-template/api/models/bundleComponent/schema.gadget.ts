import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundleComponent" model, go to https://customized-bundle-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "FSzPkU1qwcRV",
  fields: {
    bundle: {
      type: "belongsTo",
      parent: { model: "bundle" },
      storageKey: "gZnTNoc2IA4j",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "I31fEqQtjpyU",
    },
    variant: {
      type: "belongsTo",
      parent: { model: "shopifyProductVariant" },
      storageKey: "FeDN9dHaVKfO",
    },
  },
};
