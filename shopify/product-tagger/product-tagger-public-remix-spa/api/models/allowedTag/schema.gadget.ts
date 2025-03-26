import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "allowedTag" model, go to https://product-tagger-public-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "uXW-klTyGSVJ",
  fields: {
    keyword: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "63t1thCjf9ev",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "j80_rg3Y3_yf",
    },
  },
};
