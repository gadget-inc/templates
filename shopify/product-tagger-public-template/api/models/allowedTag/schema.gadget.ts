import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "allowedTag" model, go to https://product-tagger-public-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "jdCNHJO-cIbP",
  fields: {
    keyword: {
      type: "string",
      validations: { required: true },
      storageKey: "54d461uY4Q1h",
      // The Shopify product webhook path filters by keyword, so keep this field
      // indexed to avoid full-table scans as merchants add more allowed tags.
      filterIndex: true,
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "TsuXBFudzxKu",
      searchIndex: false,
    },
  },
};
