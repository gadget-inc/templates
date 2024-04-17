import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "plan" model, go to https://usage-subscription-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-2u4hjmGVD9pq",
  fields: {
    cappedAmount: {
      type: "number",
      default: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: null },
      },
      storageKey:
        "ModelField-TMTQ41M7P8s8::FieldStorageEpoch-MuqKUSeD-Tex",
    },
    currency: {
      type: "string",
      default: "CAD",
      validations: { required: true },
      storageKey:
        "ModelField-S1RaAraiSA85::FieldStorageEpoch-XGw04uvQUGqA",
    },
    description: {
      type: "string",
      validations: { required: true },
      storageKey:
        "ModelField-4WMhCwRyY0fI::FieldStorageEpoch-tiT4aTOcd7d3",
    },
    name: {
      type: "string",
      validations: { required: true },
      storageKey:
        "ModelField-tIn6howQ-6N4::FieldStorageEpoch-KK4QpJUP5vWi",
    },
    pricePerOrder: {
      type: "number",
      default: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: null },
      },
      storageKey:
        "ModelField-BRsYNVf8D7jb::FieldStorageEpoch-tqGOCN2SNbU5",
    },
    shops: {
      type: "hasMany",
      children: { model: "shopifyShop", belongsToField: "plan" },
      storageKey:
        "ModelField--lda5OV-0OWi::FieldStorageEpoch-pzGHVAhKRTpP",
    },
    trialDays: {
      type: "number",
      default: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: null },
      },
      storageKey:
        "ModelField-MylV6Ddc-Lxp::FieldStorageEpoch-4hFTpPqOfuhK",
    },
  },
};
