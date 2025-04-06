import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyFile" model, go to https://wishlist-custom-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-File",
  fields: {},
  shopify: {
    fields: [
      "alt",
      "boundingBox",
      "duration",
      "embedUrl",
      "fileErrors",
      "fileStatus",
      "filename",
      "host",
      "image",
      "mediaContentType",
      "mediaErrors",
      "mediaWarnings",
      "mimetype",
      "originUrl",
      "originalFileSize",
      "originalSource",
      "preview",
      "product",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "sources",
      "status",
      "type",
      "url",
    ],
  },
};
