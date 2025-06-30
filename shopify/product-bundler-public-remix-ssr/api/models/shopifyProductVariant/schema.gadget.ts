import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProductVariant" model, go to https://product-bundler-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-ProductVariant",
  fields: {
    bundle: {
      type: "hasOne",
      child: { model: "bundle", belongsToField: "bundleVariant" },
      storageKey: "lTnb5nkeSFgr",
    },
    bundles: {
      type: "hasManyThrough",
      sibling: { model: "bundle", relatedField: "productVariants" },
      join: {
        model: "bundleComponent",
        belongsToSelfField: "productVariant",
        belongsToSiblingField: "bundle",
      },
      storageKey: "F59xUxuiPjYd",
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
      storageKey: "7Edj_3xtZB7Y",
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
      storageKey: "zyr3q6TqRv4V",
    },
  },
  shopify: {
    fields: [
      "barcode",
      "compareAtPrice",
      "inventoryPolicy",
      "inventoryQuantity",
      "option1",
      "option2",
      "option3",
      "position",
      "presentmentPrices",
      "price",
      "product",
      "selectedOptions",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "sku",
      "taxCode",
      "taxable",
      "title",
    ],
  },
};
