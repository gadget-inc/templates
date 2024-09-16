import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://stripe-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "o5tGBdPbD0T2",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "orwn5L8LkTIj",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "z1uwIRAa86n2",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "06p4BZ77-kUq",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "UFqRqZEEgtxH",
    },
    firstName: { type: "string", storageKey: "Cq10wbFVM8U1" },
    googleImageUrl: { type: "url", storageKey: "YDG05_1JCLZt" },
    googleProfileId: { type: "string", storageKey: "Fk-pPeyulN2w" },
    lastName: { type: "string", storageKey: "vVTzmydd97m3" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "MWU0V7JM3NTm",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "j5BNy63o2f3C",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "q23C8TQNIeiX",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "UXiWze6TjIvB",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "2En1rQZgM_nR",
    },
    stripeCustomerId: { type: "string", storageKey: "L7QuHLk2q15W" },
    stripeSubscription: {
      type: "hasOne",
      child: { model: "stripe/subscription", belongsToField: "user" },
      storageKey: "bZjZkeQMnmeh",
    },
  },
};
