import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "instagramPost" model, go to https://shopify-instagram-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "HhmVME72DrBv",
  fields: {
    account: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "instagramAccount" },
      storageKey: "ThFWzhFy0YHk",
    },
    caption: { type: "string", storageKey: "onFhAsgDhSSO" },
    instagramId: {
      type: "string",
      validations: {
        required: true,
        unique: { scopeByField: "shop" },
      },
      storageKey: "DS8kslQ-BQ9C",
    },
    mediaType: {
      type: "string",
      validations: { required: true },
      storageKey: "5iZhA-3FZFyG",
    },
    mediaURL: {
      type: "url",
      validations: { required: true },
      storageKey: "aDTpdHL9jMbw",
    },
    metaobjectId: { type: "string", storageKey: "PQ5crRhNk13M" },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "QSvElqaJGHh9",
    },
  },
};
