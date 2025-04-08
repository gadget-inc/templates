import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://blog-internal-rrv7-f-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "Y32-X45A3G7J",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "WYRKRlkcbFTp",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "uu63B-hodzZs",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "x6b0GWRP9imZ",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "DkOaJyrMnK2z",
    },
    firstName: { type: "string", storageKey: "IQr-Y-tyxTMx" },
    googleImageUrl: { type: "url", storageKey: "xJWcIR78yLZR" },
    googleProfileId: { type: "string", storageKey: "6CuwpSV44YC8" },
    lastName: { type: "string", storageKey: "OYMHfs77p3JE" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "9-mAivDsEcVL",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "RcXBfdoxCTgA",
    },
    posts: {
      type: "hasMany",
      children: { model: "post", belongsToField: "user" },
      storageKey: "wu1RAOvvARgc",
    },
    profilePicture: {
      type: "file",
      allowPublicAccess: true,
      storageKey: "aDI2usvcOclY",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "g3ZgT94UisS-",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "Ut-pZR0-OjsH",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "f1HA1k2pQ5Ib",
    },
  },
};
