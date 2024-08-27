import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "usageRecord" model, go to https://usage-subscription-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-X2hgouf-pF6a",
  fields: {
    currency: {
      type: "string",
      storageKey:
        "ModelField-mW6Bxi2mpr8t::FieldStorageEpoch-1w35ky8_5grO",
    },
    price: {
      type: "number",
      storageKey:
        "ModelField-0kGUmQnQ8HBg::FieldStorageEpoch-1y4Y_QkS15T9",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey:
        "ModelField-sjtkuMedtkSP::FieldStorageEpoch-XhyqBOzHTXL8",
    },
  },
};
