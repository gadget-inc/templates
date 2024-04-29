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
    grams: {
      type: "number",
      storageKey:
        "ModelField-DataModel-Shopify-ProductVariant-grams::FieldStorageEpoch-DataModel-Shopify-ProductVariant-grams-initial",
    },
    inventoryQuantityAdjustment: {
      type: "number",
      storageKey:
        "ModelField-DataModel-Shopify-ProductVariant-inventory_quantity_adjustment::FieldStorageEpoch-DataModel-Shopify-ProductVariant-inventory_quantity_adjustment-initial",
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
    oldInventoryQuantity: {
      type: "number",
      storageKey:
        "ModelField-DataModel-Shopify-ProductVariant-old_inventory_quantity::FieldStorageEpoch-DataModel-Shopify-ProductVariant-old_inventory_quantity-initial",
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
