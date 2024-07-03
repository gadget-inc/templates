import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProductVariant" model, go to https://customized-bundle-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-ProductVariant",
  fields: {
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
    grams: {
      type: "number",
      storageKey:
        "ModelField-DataModel-Shopify-ProductVariant-grams::FieldStorageEpoch-DataModel-Shopify-ProductVariant-grams-initial",
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
      "inventoryManagement",
      "inventoryPolicy",
      "inventoryQuantity",
      "option1",
      "option2",
      "option3",
      "position",
      "presentmentPrices",
      "price",
      "product",
      "productImage",
      "requiresShipping",
      "selectedOptions",
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