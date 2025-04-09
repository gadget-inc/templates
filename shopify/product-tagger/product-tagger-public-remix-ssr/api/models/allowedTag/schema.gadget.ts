import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "allowedTag" model, go to https://product-tagger-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "vN7Yf3sNdlgM",
  fields: {
    keyword: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "rCa7kMZv27o6",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "V-R3amYDIyJH",
    },
  },
};
