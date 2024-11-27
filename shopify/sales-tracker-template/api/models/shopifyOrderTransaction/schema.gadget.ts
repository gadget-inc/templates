import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyOrderTransaction" model, go to https://sales-tracker-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-OrderTransaction",
  fields: {
    shopMoney: {
      type: "number",
      default: 0,
      storageKey:
        "ModelField-aVlgUBVFhtRc::FieldStorageEpoch-zDCAgYT7XKcZ",
    },
  },
  shopify: {
    fields: [
      "amount",
      "authorization",
      "authorizationExpiresAt",
      "children",
      "currency",
      "errorCode",
      "extendedAuthorizationAttributes",
      "gateway",
      "kind",
      "message",
      "multicapturable",
      "order",
      "parent",
      "paymentDetails",
      "paymentId",
      "paymentsRefundAttributes",
      "processedAt",
      "receipt",
      "refund",
      "shop",
      "shopifyCreatedAt",
      "sourceName",
      "status",
      "test",
      "totalUnsettledSet",
    ],
  },
};