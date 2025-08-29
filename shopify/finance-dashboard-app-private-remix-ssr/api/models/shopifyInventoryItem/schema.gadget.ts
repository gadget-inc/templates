import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyInventoryItem" model, go to https://finance-dashboard-app.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-InventoryItem",
  fields: {},
  shopify: {
    fields: [
      "cost",
      "countryCodeOfOrigin",
      "countryHarmonizedSystemCodes",
      "harmonizedSystemCode",
      "productVariant",
      "provinceCodeOfOrigin",
      "requiresShipping",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "sku",
      "tracked",
      "weightUnit",
      "weightValue",
    ],
  },
};
