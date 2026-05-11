import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://shop-mini-globe-demo.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "rYSvdOXDBgc5",
  fields: {
    miniBuyer: {
      type: "belongsTo",
      parent: { model: "miniBuyer" },
      storageKey: "vqjTvMoC-Eav",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "cGPNDVcwG016",
    },
  },
};
