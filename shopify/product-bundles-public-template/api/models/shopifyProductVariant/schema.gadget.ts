import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProductVariant" model, go to https://product-bundles-public-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "DataModel-Shopify-ProductVariant",
  fields: {
    bundle: {
      type: "hasOne",
      child: { model: "bundle", belongsToField: "bundleVariant" },
      storageKey: "__rdDW8cjKdk",
    },
    bundles: {
      type: "hasManyThrough",
      sibling: { model: "bundle", relatedField: "productVariants" },
      join: {
        model: "bundleComponent",
        belongsToSelfField: "productVariant",
        belongsToSiblingField: "bundle",
      },
      storageKey: "R3w2MZTVN9Lr",
    },
    componentReference: {
      type: "json",
      shopifyMetafield: {
        privateMetafield: false,
        namespace: "bundle",
        key: "componentReference",
        metafieldType: "variant_reference",
        allowMultipleEntries: true,
      },
      storageKey: "g5_D2XsQFahX",
      filterIndex: false,
      searchIndex: false,
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
      storageKey: "Lud4DIW5r8wX",
      filterIndex: false,
      searchIndex: false,
    },
  },
  shopify: {
    fields: {
      barcode: { searchIndex: false },
      compareAtPrice: { filterIndex: false, searchIndex: false },
      inventoryPolicy: { filterIndex: false, searchIndex: false },
      inventoryQuantity: { filterIndex: false, searchIndex: false },
      option1: { filterIndex: false },
      option2: { filterIndex: false },
      option3: { filterIndex: false },
      position: { searchIndex: false },
      price: { searchIndex: false },
      product: { searchIndex: false },
      shop: { searchIndex: false },
      shopifyCreatedAt: { filterIndex: false, searchIndex: false },
      shopifyUpdatedAt: { filterIndex: false, searchIndex: false },
      sku: true,
      taxable: { filterIndex: false, searchIndex: false },
      title: { filterIndex: false },
    },
  },
};
