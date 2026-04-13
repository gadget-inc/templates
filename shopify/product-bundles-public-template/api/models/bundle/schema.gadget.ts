import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundle" model, go to https://product-bundles-public-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "91vv5CEskZ02",
  fields: {
    bundleComponentCount: {
      type: "computed",
      sourceFile: "api/models/bundle/bundleComponentCount.gelly",
      storageKey: "3TDiuYj55NaY",
    },
    bundleVariant: {
      type: "belongsTo",
      parent: { model: "shopifyProductVariant" },
      storageKey: "kjruXdmC9Ebz",
    },
    description: { type: "string", storageKey: "f-OnKtgYDyv-" },
    price: {
      type: "number",
      default: 0,
      decimals: 2,
      validations: {
        required: true,
        numberRange: { min: 0, max: null },
      },
      storageKey: "JxlonIK-K5q9",
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
      storageKey: "zrWPLZF0N805",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "Tkk7nNeVzWiM",
    },
    status: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["active", "archived", "draft"],
      validations: { required: true },
      storageKey: "0XA8DqXelKys",
    },
    title: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "cSuGr4BoYmAG",
    },
  },
};
