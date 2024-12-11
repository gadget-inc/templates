import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "stripe/subscription" model, go to https://stripe-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "GpZItUP1kjUl",
  fields: {
    cancelAtPeriodEnd: {
      type: "boolean",
      storageKey: "CDo9Hp38GYiT",
    },
    currency: { type: "string", storageKey: "8iGHViysrhYc" },
    currentPeriodEnd: {
      type: "dateTime",
      includeTime: true,
      storageKey: "gvecpTEvBmS8",
    },
    currentPeriodStart: {
      type: "dateTime",
      includeTime: true,
      storageKey: "azoAcbwC_ISw",
    },
    customer: { type: "string", storageKey: "-ZtjuiE88RIs" },
    defaultPaymentMethod: {
      type: "string",
      storageKey: "4vhKvA49Xjks",
    },
    description: { type: "string", storageKey: "2sdU0G0nSTJH" },
    latestInvoice: { type: "string", storageKey: "dLECN98ghGz0" },
    metadata: { type: "json", storageKey: "qUpxQpazkSF4" },
    pendingSetupIntent: {
      type: "string",
      storageKey: "Enl1UCnq2aU2",
    },
    pendingUpdate: { type: "json", storageKey: "yYWKTuYnJyTN" },
    status: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: [
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
      ],
      storageKey: "TmLk6MPFr2V4",
    },
    stripeId: {
      type: "string",
      validations: {
        required: true,
        unique: { caseSensitive: true },
      },
      storageKey: "mAro0amOpR1a",
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "_SA2lcRWQHVe",
    },
  },
};
