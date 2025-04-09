import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "allowedTag" model, go to https://product-tagger-public-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "fZCUNd6xpTpE",
  fields: {
    keyword: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "-7JuZTukuMZF",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "4OdkNq24HMVF",
    },
  },
};
