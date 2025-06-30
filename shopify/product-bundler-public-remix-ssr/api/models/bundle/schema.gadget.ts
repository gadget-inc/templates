import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundle" model, go to https://product-bundler-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "0-0eJAFBKngl",
  fields: {
    bundleComponentCount: {
      type: "computed",
      sourceFile: "api/models/bundle/bundleComponentCount.gelly",
      storageKey: "dFHXjZbzPcXK",
    },
    bundleVariant: {
      type: "belongsTo",
      parent: { model: "shopifyProductVariant" },
      storageKey: "I3QjbsJ2cy4g",
    },
    description: { type: "string", storageKey: "nmRNRWnxUT_G" },
    price: {
      type: "number",
      default: 0,
      decimals: 2,
      validations: {
        required: true,
        numberRange: { min: 0, max: null },
      },
      storageKey: "rkgiGjmLRRdY",
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
      storageKey: "lzl-Ofd4Y8zq",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "fDchSGoQZUyU",
    },
    status: {
      type: "enum",
      default: "active",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["active", "archived", "draft"],
      validations: { required: true },
      storageKey: "cz36c2DHRyJ3",
    },
    title: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "RoXSGH4GiNS8",
    },
    titleLowercase: {
      type: "string",
      validations: { required: true },
      storageKey: "OtNy7Dj_z-Lh",
    },
  },
};
