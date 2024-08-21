import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "movie" model, go to https://ai-screenwriter-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Ftby81PzJMrj",
  fields: {
    embedding: { type: "vector", storageKey: "ModelField-rXH53WFnF7hV::FieldStorageEpoch-Q4XJ2dVY7tmc" },
    quote: { type: "string", validations: { required: true }, storageKey: "ModelField-yuoarz_x9LBM::FieldStorageEpoch-0P7lBkJuI5M-" },
    title: { type: "string", validations: { required: true }, storageKey: "ModelField-7XLG1NsJMawS::FieldStorageEpoch-m_cCvp7FxjRK" },
  },
};
