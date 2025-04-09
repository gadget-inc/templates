import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundle" model, go to https://product-bundler-public-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "fE4R-LIU3aCi",
  fields: {
    bundleComponentCount: {
      type: "computed",
      sourceFile: "api/models/bundle/bundleComponentCount.gelly",
      storageKey: "g1J38xudfBNC",
    },
    bundleVariant: {
      type: "belongsTo",
      parent: { model: "shopifyProductVariant" },
      storageKey: "bGT8vXvoPGW_",
    },
    description: { type: "string", storageKey: "PCIe-oEn7rSi" },
    price: {
      type: "number",
      default: 0,
      decimals: 2,
      validations: {
        required: true,
        numberRange: { min: 0, max: null },
      },
      storageKey: "xa_2maVc5zUM",
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
      storageKey: "2MfBBWc9w81f",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "0STe0NgJQ1oU",
    },
    status: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["active", "archived", "draft"],
      validations: { required: true },
      storageKey: "R_jJRy02zaqf",
    },
    title: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "SusE5xeTfP1P",
    },
    titleLowercase: {
      type: "string",
      validations: { required: true },
      storageKey: "x7kW94aCpQEu",
    },
  },
};
