import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProduct" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Product",
  fields: {
    category: {
      type: "json",
      storageKey:
        "ModelField-DataModel-Shopify-Product-__gadget_graphql_category::FieldStorageEpoch-DataModel-Shopify-Product-__gadget_graphql_category-initial",
    },
    publishedScope: {
      type: "string",
      storageKey:
        "ModelField-DataModel-Shopify-Product-published_scope::FieldStorageEpoch-DataModel-Shopify-Product-published_scope-initial",
    },
    recommendedProducts: {
      type: "hasMany",
      children: {
        model: "recommendedProduct",
        belongsToField: "productSuggestion",
      },
      storageKey:
        "ModelField-hV0xcRbPacCq::FieldStorageEpoch-ql2PCdsgDfzN",
    },
    shopperSuggestion: {
      type: "hasManyThrough",
      sibling: {
        model: "quizResult",
        relatedField: "shopperSuggestion",
      },
      join: {
        model: "shopperSuggestion",
        belongsToSelfField: "product",
        belongsToSiblingField: "quizResult",
      },
      storageKey:
        "ModelField-SbnU2h26KE2b::FieldStorageEpoch-eiiPP65HAOU_",
    },
  },
  shopify: {
    fields: [
      "body",
      "compareAtPriceRange",
      "handle",
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
