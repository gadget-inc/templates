import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "review" model, go to https://product-reviews-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "05LmzBe_CIyf",
  fields: {
    customer: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyCustomer" },
      storageKey: "bT0Adl6mg5Lc",
    },
    order: {
      type: "belongsTo",
      parent: { model: "shopifyOrder" },
      storageKey: "6cS42mJLsWyc",
    },
    product: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "shopifyProduct" },
      storageKey: "YkA-cs5aMejq",
    },
  },
};
