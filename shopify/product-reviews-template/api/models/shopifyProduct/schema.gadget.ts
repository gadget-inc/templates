import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProduct" model, go to https://product-reviews-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Product",
  fields: {
    reviews: {
      type: "hasMany",
      children: { model: "review", belongsToField: "product" },
      storageKey: "9q0TXpTv2hmS",
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
      storageKey: "zn2QVWbMprWt",
    },
  },
  shopify: {
    fields: [
      "body",
      "category",
      "compareAtPriceRange",
      "featuredMedia",
      "handle",
      "hasVariantsThatRequiresComponents",
      "media",
      "orderLineItems",
      "productCategory",
      "productType",
      "publishedAt",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "status",
      "tags",
      "templateSuffix",
      "title",
      "vendor",
    ],
  },
};
