import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProductVariant" model, go to https://customized-bundle-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-ProductVariant",
  fields: {
    bundle: {
      type: "hasOne",
      child: { model: "bundle", belongsToField: "bundleVariant" },
      storageKey: "NRBvnFNCfs7y",
    },
    bundles: {
      type: "hasManyThrough",
      sibling: { model: "bundle", relatedField: "productVariants" },
      join: {
        model: "bundleComponent",
        belongsToSelfField: "productVariant",
        belongsToSiblingField: "bundle",
      },
      storageKey: "5bhdruCB4y4K",
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
      storageKey: "3qhbYcU7_k0A",
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
