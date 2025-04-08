import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://blog-internal-rrv7-f-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "1K0Zd-MagwjR",
  fields: {
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "RpJ7OV3dAbIq",
    },
  },
};
