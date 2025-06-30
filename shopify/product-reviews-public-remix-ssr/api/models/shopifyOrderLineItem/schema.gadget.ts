import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyOrderLineItem" model, go to https://product-reviews-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-OrderLineItem",
  fields: {
    reviewCreated: { type: "boolean", storageKey: "2coIMP9UJkWP" },
    reviews: {
      type: "hasMany",
      children: { model: "review", belongsToField: "lineItem" },
      storageKey: "yhrEXJTW2kUN",
    },
  },
  shopify: { fields: ["order", "product", "shop"] },
};
