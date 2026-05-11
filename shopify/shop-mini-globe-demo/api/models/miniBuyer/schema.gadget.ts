import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "miniBuyer" model, go to https://shop-mini-globe-demo.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "OZBBIGX1noBp",
  fields: {
    publicId: {
      type: "string",
      validations: { unique: true },
      storageKey: "MZeodFFrBFHk",
    },
    session: {
      type: "hasOne",
      child: { model: "session", belongsToField: "miniBuyer" },
      storageKey: "ake4kavuP-hK",
    },
    shipments: {
      type: "hasMany",
      children: { model: "shipment", belongsToField: "miniBuyer" },
      storageKey: "mnBuyrShipsRel",
    },
    state: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["VERIFIED", "GUEST"],
      storageKey: "8GA1lssMqfRI",
    },
    tokenExpiresAt: {
      type: "dateTime",
      includeTime: true,
      storageKey: "OqOitenZ0CaI",
    },
  },
};
