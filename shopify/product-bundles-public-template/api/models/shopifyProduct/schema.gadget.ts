import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProduct" model, go to https://product-bundles-public-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "DataModel-Shopify-Product",
  fields: {},
  shopify: {
    fields: {
      body: true,
      category: true,
      featuredMedia: true,
      handle: true,
      hasVariantsThatRequiresComponents: { searchIndex: false },
      media: true,
      productType: true,
      publishedAt: { searchIndex: false },
      shop: { searchIndex: false },
      shopifyCreatedAt: { filterIndex: false, searchIndex: false },
      shopifyUpdatedAt: { filterIndex: false, searchIndex: false },
      status: { searchIndex: false },
      tags: true,
      templateSuffix: { filterIndex: false, searchIndex: false },
      title: true,
      variants: true,
      vendor: true,
    },
  },
};
