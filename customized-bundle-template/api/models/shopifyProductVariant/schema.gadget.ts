import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProductVariant" model, go to https://bundle-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-ProductVariant",
  fields: {
    bundle: {
      type: "hasOne",
      child: { model: "bundle", belongsToField: "bundleVariant" },
      storageKey: "jUO_fqOp2qYn",
    },
    bundleComponents: {
      type: "hasManyThrough",
      sibling: { model: "bundle", relatedField: "bundleComponents" },
      join: {
        model: "bundleComponent",
        belongsToSelfField: "variant",
        belongsToSiblingField: "bundle",
      },
      storageKey: "HSWeU9UJgd_Q",
    },
    isBundle: {
      type: "boolean",
      shopifyMetafield: {
        privateMetafield: false,
        namespace: "bundle",
        key: "isBundle",
        metafieldType: "boolean",
        allowMultipleEntries: false,
      },
      storageKey: "cXcZnIK0yBPC",
    },
  },
  shopify: {
    fields: [
      "barcode",
      "compareAtPrice",
      "fulfillmentService",
      "grams",
      "inventoryManagement",
      "inventoryPolicy",
      "inventoryQuantity",
      "inventoryQuantityAdjustment",
      "oldInventoryQuantity",
      "option1",
      "option2",
      "option3",
      "position",
      "presentmentPrices",
      "price",
      "product",
      "requiresShipping",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "sku",
      "taxCode",
      "taxable",
      "title",
      "weight",
      "weightUnit",
    ],
  },
};
