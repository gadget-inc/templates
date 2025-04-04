import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "bundle" model, go to https://product-bundler-public-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "17EjC9ZGcPnH",
  fields: {
    bundleComponentCount: {
      type: "computed",
      sourceFile: "api/models/bundle/bundleComponentCount.gelly",
      storageKey: "-w5MDgUoQz-s",
    },
    bundleVariant: {
      type: "belongsTo",
      parent: { model: "shopifyProductVariant" },
      storageKey: "rPGRvyjlFaA1",
    },
    componentReferenceMetafieldId: {
      type: "string",
      storageKey: "TIJLNHtPL50J",
    },
    description: { type: "string", storageKey: "e22pdpDsTcIE" },
    price: {
      type: "number",
      default: 0,
      decimals: 2,
      validations: {
        required: true,
        numberRange: { min: 0, max: null },
      },
      storageKey: "8My3_dEXAvRF",
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
      storageKey: "q2f2NfGAM59t",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "tW0QibNbjWZv",
    },
    status: {
      type: "enum",
      default: "active",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["active", "archived", "draft"],
      validations: { required: true },
      storageKey: "VpvtvkHZUeUR",
    },
    title: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "-tmA8hu0Zosp",
    },
    titleLowercase: {
      type: "string",
      validations: { required: true },
      storageKey: "BoNr2vQckua6",
    },
  },
};
