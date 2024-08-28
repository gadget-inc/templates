import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyAppSubscription" model, go to https://usage-subscription-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-AppSubscription",
  fields: {},
  shopify: {
    fields: [
      "currentPeriodEnd",
      "lineItems",
      "name",
      "returnUrl",
      "shop",
      "shopifyCreatedAt",
      "status",
      "test",
      "trialDays",
    ],
  },
};
