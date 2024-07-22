import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://webflow-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "ILkELugPIuLw",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "CS9lJ3ZJ1wva",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "P180LCpUobiw",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "7kbVus-YDdmO",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "0aajomdvFIWe",
    },
    firstName: { type: "string", storageKey: "l1l1ya7x-Tgk" },
    googleImageUrl: { type: "url", storageKey: "FMODQVK81Z3W" },
    googleProfileId: { type: "string", storageKey: "yy8r8_nRiwfA" },
    lastName: { type: "string", storageKey: "1F4hvLBPwPkr" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "VRJTL6CFu1_D",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "qyrE9S-ION34",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "uvpgvZoHhugJ",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "9I-jxrY9m_11",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "NG_5Euo2ZEc7",
    },
  },
};
