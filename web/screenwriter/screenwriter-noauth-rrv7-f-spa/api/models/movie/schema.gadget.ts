import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "movie" model, go to https://screenwriter-noauth-rrv7-f-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "GALXtAMRi8-M",
  fields: {
    embedding: { type: "vector", storageKey: "HKWIoRkQ9nB-" },
    quote: {
      type: "string",
      validations: { required: true },
      storageKey: "0oLX9vyI4O6t",
    },
    title: {
      type: "string",
      validations: { required: true },
      storageKey: "upNswgsig2xL",
    },
  },
};
