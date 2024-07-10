import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundle" model, go to https://customized-bundle-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "ZzZwQ9y4-thr",
  fields: {
    bundleComponentCount: {
      type: "computed",
      sourceFile: "api/models/bundle/bundleComponentCount.gelly",
      storageKey: "3k0IVUf6txol",
    },
    bundleVariant: {
      type: "belongsTo",
      parent: { model: "shopifyProductVariant" },
      storageKey: "nCho86f45q8o",
    },
    componentReferenceMetafieldId: {
      type: "string",
      storageKey: "FLLwh6h5SSoK",
    },
    description: { type: "string", storageKey: "rXyzN2mr5Sm7" },
    price: {
      type: "number",
      default: 0,
      decimals: 2,
      validations: { numberRange: { min: 0, max: null } },
      storageKey: "zCSKCmHj0e79",
    },
    productVariants: {
      type: "hasManyThrough",
      sibling: {
        model: "shopifyProductVariant",
        relatedField: "bundles",
      },
      join: {
        model: "bundleComponent",
        belongsToSelfField: "bundle",
        belongsToSiblingField: "productVariant",
      },
      storageKey: "YF1Us5XmK1jH",
    },
    requiresComponents: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey: "cfT6FyI1ZXZY",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "4UnjMdSSf0na",
    },
    status: {
      type: "enum",
      default: "active",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["active", "archived", "draft"],
      storageKey: "oluQn15WMTaa",
    },
    title: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "NzJl8zUoaFJF",
    },
    titleLowercase: { type: "string", storageKey: "UWVTWubHPQ5o" },
  },
};
