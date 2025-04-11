import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "movie" model, go to https://screenwriter-noauth-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "cnDbRIZ-Mqbq",
  fields: {
    embedding: { type: "vector", storageKey: "gkc0w45KzzdN" },
    quote: {
      type: "string",
      validations: { required: true },
      storageKey: "AcZyjmtfbWRE",
    },
    title: {
      type: "string",
      validations: { required: true },
      storageKey: "cAvOPxadDP72",
    },
  },
};
