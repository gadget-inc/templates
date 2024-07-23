import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "instagramAccount" model, go to https://shopify-instagram-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "n2WWX_NASVgJ",
  fields: {
    accessToken: {
      type: "encryptedString",
      validations: { required: true },
      storageKey: "jBv9_tAgWAFP::String-jBv9_tAgWAFP",
    },
    accessTokenExpiresAt: {
      type: "dateTime",
      includeTime: true,
      validations: { required: true },
      storageKey: "ksR-eSUhpJqa",
    },
    instagramPosts: {
      type: "hasMany",
      children: { model: "instagramPost", belongsToField: "account" },
      storageKey: "ECMp31i96y0N",
    },
    name: {
      type: "string",
      validations: { required: true },
      storageKey: "HbP1MDOWw1br",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "-LLQYS4CLOEV",
    },
  },
};
