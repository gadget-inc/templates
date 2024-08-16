import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "quiz" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-BXOP6MegQeUr",
  fields: {
    body: {
      type: "string",
      storageKey:
        "ModelField-5oEd6atyoMPx::FieldStorageEpoch-6aDNPBw6-Pnc",
    },
    questions: {
      type: "hasMany",
      children: { model: "question", belongsToField: "quiz" },
      storageKey:
        "ModelField-HYdthlKPDNlJ::FieldStorageEpoch-ukUaPq-xIhK4",
    },
    results: {
      type: "hasMany",
      children: { model: "quizResult", belongsToField: "quiz" },
      storageKey:
        "ModelField-cLcwX4dEiR2P::FieldStorageEpoch-URNQGrpumpAD",
    },
    shop: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyShop" },
      storageKey: "6oDVPUHsD5yb",
    },
    slug: {
      type: "string",
      validations: { required: true },
      storageKey:
        "ModelField-FQ-A7WYxrkz0::FieldStorageEpoch-eSIbOSdBfcaT",
    },
    title: {
      type: "string",
      validations: { required: true },
      storageKey:
        "ModelField-KyjkQ49hFcrF::FieldStorageEpoch-XRG4kTEeCh2m",
    },
  },
};
