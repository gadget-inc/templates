import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProduct" model, go to https://product-quiz-custom-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Product",
  fields: {
    quizResults: {
      type: "hasManyThrough",
      sibling: { model: "quizResult", relatedField: "products" },
      join: {
        model: "shopperSuggestion",
        belongsToSelfField: "product",
        belongsToSiblingField: "quizResult",
      },
      storageKey: "hI3qVrL2c5Cn",
    },
    recommendedProducts: {
      type: "hasMany",
      children: {
        model: "recommendedProduct",
        belongsToField: "productSuggestion",
      },
      storageKey: "Lt6GN5lnVdyf",
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
