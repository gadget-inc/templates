import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shipment" model, go to https://shop-mini-globe-demo.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "CZh0KfYRA6Gc",
  fields: {
    lastFetchedAt: {
      type: "dateTime",
      includeTime: true,
      storageKey: "1FvvpOszRPHX",
    },
    miniBuyer: {
      type: "belongsTo",
      parent: { model: "miniBuyer" },
      storageKey: "shipMnBuyrRel",
    },
    path: { type: "json", storageKey: "LEtTpSrdC8vu" },
    trackingNumber: { type: "string", storageKey: "JEk9-Xyoahbm" },
  },
};
