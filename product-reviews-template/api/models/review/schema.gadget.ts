import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "review" model, go to https://product-reviews-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "05LmzBe_CIyf",
  fields: {
    anonymous: {
      type: "boolean",
      default: false,
      storageKey: "fyHMWNtwRseY",
    },
    approved: {
      type: "boolean",
      default: false,
      storageKey: "yZssP-8duQ5f",
    },
    content: {
      type: "string",
      validations: { required: true },
      storageKey: "IU5npbrI6A3h",
    },
    customer: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyCustomer" },
      storageKey: "bT0Adl6mg5Lc",
    },
    metaobjectId: { type: "string", storageKey: "MDTelmNZFvN8" },
    order: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyOrder" },
      storageKey: "6cS42mJLsWyc",
    },
    product: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyProduct" },
      storageKey: "YkA-cs5aMejq",
    },
    rating: {
      type: "number",
      decimals: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: 5 },
      },
      storageKey: "Cuw9VTG9Higw",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "K1OxV12nco9E",
    },
  },
};
