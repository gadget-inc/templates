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
    fulfillmentService: {
      type: "string",
      storageKey:
        "ModelField-DataModel-Shopify-ProductVariant-fulfillment_service::FieldStorageEpoch-DataModel-Shopify-ProductVariant-fulfillment_service-initial",
    },
    grams: {
      type: "number",
      storageKey:
        "ModelField-DataModel-Shopify-ProductVariant-grams::FieldStorageEpoch-DataModel-Shopify-ProductVariant-grams-initial",
    },
    inventoryManagement: {
      type: "string",
      storageKey:
        "ModelField-DataModel-Shopify-ProductVariant-inventory_management::FieldStorageEpoch-DataModel-Shopify-ProductVariant-inventory_management-initial",
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
    requiresShipping: {
      type: "boolean",
      storageKey:
        "ModelField-DataModel-Shopify-ProductVariant-requires_shipping::FieldStorageEpoch-DataModel-Shopify-ProductVariant-requires_shipping-initial",
    },
    weight: {
      type: "number",
      storageKey:
        "ModelField-DataModel-Shopify-ProductVariant-weight::FieldStorageEpoch-DataModel-Shopify-ProductVariant-weight-initial",
    },
    weightUnit: {
      type: "string",
      storageKey:
        "ModelField-DataModel-Shopify-ProductVariant-weight_unit::FieldStorageEpoch-DataModel-Shopify-ProductVariant-weight_unit-initial",
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
      "productImage",
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
