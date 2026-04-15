import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProduct" model, go to https://product-tagger-public-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "DataModel-Shopify-Product",
  fields: {},
  searchIndex: false,
  shopify: {
    fields: {
      body: { filterIndex: false, searchIndex: false },
      category: { filterIndex: false, searchIndex: false },
      handle: { filterIndex: false, searchIndex: false },
      hasVariantsThatRequiresComponents: {
        filterIndex: false,
        searchIndex: false,
      },
      productType: { filterIndex: false, searchIndex: false },
      publishedAt: { filterIndex: false, searchIndex: false },
      shop: { searchIndex: false },
      shopifyCreatedAt: { filterIndex: false, searchIndex: false },
      shopifyUpdatedAt: { filterIndex: false, searchIndex: false },
      status: { filterIndex: false, searchIndex: false },
      tags: { filterIndex: false, searchIndex: false },
      templateSuffix: { filterIndex: false, searchIndex: false },
      title: { filterIndex: false, searchIndex: false },
      vendor: { filterIndex: false, searchIndex: false },
    },
  },
};
