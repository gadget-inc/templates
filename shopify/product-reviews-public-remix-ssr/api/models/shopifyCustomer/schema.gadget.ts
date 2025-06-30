import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyCustomer" model, go to https://product-reviews-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Customer",
  fields: {
    reviews: {
      type: "hasMany",
      children: { model: "review", belongsToField: "customer" },
      storageKey: "vSnBpWFg5Dvs",
    },
  },
  shopify: {
    fields: [
      "email",
      "emailMarketingConsent",
      "firstName",
      "lastName",
      "lastOrder",
      "marketingOptInLevel",
      "orders",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "unsubscribeUrl",
      "validEmailAddress",
      "verifiedEmail",
    ],
  },
};
