import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "allowedTag" model, go to https://product-tagger-custom-remix-spa.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "im73vX6GZIhK",
  fields: {
    keyword: {
      type: "string",
      validations: { required: true },
      storageKey: "NeruOV4FdU5F",
    },
  },
};
