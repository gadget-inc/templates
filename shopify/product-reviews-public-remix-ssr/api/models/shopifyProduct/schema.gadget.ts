import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProduct" model, go to https://product-reviews-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Product",
  fields: {
    reviews: {
      type: "hasMany",
      children: { model: "review", belongsToField: "product" },
      storageKey: "2FRrk_ROe-5f",
    },
    reviewsMetafield: {
      type: "json",
      shopifyMetafield: {
        privateMetafield: false,
        namespace: "productReviews",
        key: "reviewMetaobjects",
        metafieldType: "json",
        allowMultipleEntries: false,
      },
      default: [],
      storageKey: "W3nYWOu9IhT5",
    },
  },
  shopify: {
    fields: [
      "featuredMedia",
      "media",
      "orderLineItems",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "title",
    ],
  },
};
