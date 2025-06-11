import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyOrder" model, go to https://product-reviews-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Order",
  fields: {
    requestReviewAfter: {
      type: "dateTime",
      includeTime: true,
      storageKey: "8S9CxZ6CUOQQ",
    },
    reviewCreationLimit: {
      type: "number",
      storageKey: "cITH3vD4aLGQ",
    },
    reviewCreationLimitReached: {
      type: "computed",
      sourceFile:
        "api/models/shopifyOrder/reviewCreationLimitReached.gelly",
      storageKey: "jcbZXyVH10Cn",
    },
    reviews: {
      type: "hasMany",
      children: { model: "review", belongsToField: "order" },
      storageKey: "OoQVLFKhGgUo",
    },
    singleUseCode: {
      type: "string",
      validations: { unique: { caseSensitive: true } },
      storageKey: "GzTtaWfbv1rN",
    },
  },
  shopify: {
    fields: [
      "customer",
      "customerLocale",
      "email",
      "fulfillmentStatus",
      "lineItems",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
    ],
  },
};
