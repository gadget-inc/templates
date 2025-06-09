import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "review" model, go to https://product-reviews-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "5cnSzwcfhif5",
  fields: {
    anonymous: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey: "4fpU-1U9M8So",
    },
    approved: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey: "hbknBXLbTjAG",
    },
    content: {
      type: "string",
      validations: { required: true },
      storageKey: "wzHxg-nPYx8u",
    },
    customer: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyCustomer" },
      storageKey: "uvnfHSxrqlpr",
    },
    lineItem: {
      type: "belongsTo",
      parent: { model: "shopifyOrderLineItem" },
      storageKey: "yrD3UH5G6G54",
    },
    metaobjectId: { type: "string", storageKey: "O5N_DVKQ9TIa" },
    order: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyOrder" },
      storageKey: "W3eL60C45GZf",
    },
    product: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyProduct" },
      storageKey: "9DEW1shOMxmA",
    },
    rating: {
      type: "number",
      validations: {
        required: true,
        numberRange: { min: 0, max: 5 },
      },
      storageKey: "KKbWEIr-1FsZ",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "eXV9gNOWfv07",
    },
  },
};
