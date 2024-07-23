import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyAppPurchaseOneTime" model, go to https://one-time-charge-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-AppPurchaseOneTime",
  fields: {},
  shopify: {
    fields: [
      "name",
      "price",
      "shop",
      "shopifyCreatedAt",
      "status",
      "test",
    ],
  },
};
