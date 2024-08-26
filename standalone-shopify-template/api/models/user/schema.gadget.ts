import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://standalone-shopify-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "fn-t9Q71MqWE",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "eSSKSIEknWuS",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "j1kv_aLCZtRr",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "3oM-nPjde_GZ",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "z5qKDesuUWq4",
    },
    firstName: { type: "string", storageKey: "T_pRsbwdO9AZ" },
    googleImageUrl: { type: "url", storageKey: "Ilf6eoXFt8ad" },
    googleProfileId: { type: "string", storageKey: "gx--J-tLK7vp" },
    lastName: { type: "string", storageKey: "IIcYfofD27sa" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "DQs71mirXjMT",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "iSsUgFzy-EOv",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "7krrkEoXLupI",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "_0sW_gWtgmwj",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "R4DybGcueR3j",
    },
    shops: {
      type: "hasManyThrough",
      sibling: { model: "shopifyShop", relatedField: "users" },
      join: {
        model: "shopPermission",
        belongsToSelfField: "user",
        belongsToSiblingField: "shop",
      },
      storageKey: "Y_gOk_-j8qTb",
    },
  },
};
