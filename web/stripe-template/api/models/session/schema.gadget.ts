import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://stripe-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "xb5AfdmETsMj",
  fields: {
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "Dvu-vQsT9Yq8",
    },
  },
};
