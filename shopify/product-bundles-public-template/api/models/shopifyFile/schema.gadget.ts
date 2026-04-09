import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyFile" model, go to https://product-bundles-public-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "DataModel-Shopify-File",
  fields: {},
  searchIndex: false,
  shopify: {
    fields: {
      alt: { filterIndex: false, searchIndex: false },
      boundingBox: { filterIndex: false, searchIndex: false },
      duration: { filterIndex: false, searchIndex: false },
      embedUrl: { filterIndex: false, searchIndex: false },
      fileErrors: { filterIndex: false, searchIndex: false },
      fileStatus: { filterIndex: false, searchIndex: false },
      filename: { filterIndex: false, searchIndex: false },
      host: { filterIndex: false, searchIndex: false },
      image: { filterIndex: false, searchIndex: false },
      mediaContentType: { searchIndex: false },
      mediaErrors: { filterIndex: false, searchIndex: false },
      mediaWarnings: { filterIndex: false, searchIndex: false },
      mimetype: { filterIndex: false, searchIndex: false },
      originUrl: { filterIndex: false, searchIndex: false },
      originalFileSize: { filterIndex: false, searchIndex: false },
      originalSource: { filterIndex: false, searchIndex: false },
      preview: { filterIndex: false, searchIndex: false },
      product: true,
      shop: { searchIndex: false },
      shopifyCreatedAt: { filterIndex: false, searchIndex: false },
      shopifyUpdatedAt: { filterIndex: false, searchIndex: false },
      sources: { filterIndex: false, searchIndex: false },
      status: { filterIndex: false, searchIndex: false },
      type: { filterIndex: false, searchIndex: false },
      url: { filterIndex: false, searchIndex: false },
    },
  },
};
