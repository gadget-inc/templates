import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "plan" model, go to https://one-time-charge-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-59aquoXBX8Gh",
  fields: {
    currency: {
      type: "string",
      default: "CAD",
      validations: { required: true },
      storageKey:
        "ModelField-aO9bnmAd_B4Q::FieldStorageEpoch-vp4bLk-pIQdc",
    },
    current: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey:
        "ModelField-HFvRsaraAiNx::FieldStorageEpoch-yz8EW4-GTgV3",
    },
    price: {
      type: "number",
      default: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: null },
      },
      storageKey:
        "ModelField-jjuh9DkS479P::FieldStorageEpoch-IlqiO8hY-9ZR",
    },
  },
};
