import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopPermission" model, go to https://external-shopify-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "yyiKjNk5MM39",
  fields: {
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "msxBdfSbgxYt",
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "GCfKQjGCU6zo",
    },
  },
};
