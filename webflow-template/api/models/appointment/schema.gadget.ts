import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "appointment" model, go to https://webflow-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "wDL_C9SzPq26",
  fields: {
    confirmed: {
      type: "boolean",
      default: false,
      storageKey: "Mzic_y0aXgSX",
    },
    date: {
      type: "dateTime",
      includeTime: true,
      storageKey: "_Sf-BQGHQ64a",
    },
    email: {
      type: "email",
      validations: { required: true },
      storageKey: "4mG9ssLxqXxO",
    },
    name: {
      type: "string",
      default: "",
      validations: { required: true },
      storageKey: "US1ioWhtdeaj",
    },
    store: {
      type: "string",
      validations: { required: true },
      storageKey: "Ymnk6R5sFmkZ",
    },
  },
};
