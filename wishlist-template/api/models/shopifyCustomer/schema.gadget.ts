import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyCustomer" model, go to https://wishlist-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Customer",
  fields: {
    sendUpdateAt: {
      type: "dateTime",
      includeTime: true,
      storageKey: "hmgCSx0Oh_PN",
    },
    updateFrequencyOverride: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["unsubscribed", "weekly", "monthly", "quarterly"],
      storageKey: "pPIoJ4TtYkUu",
    },
    wishlistCount: {
      type: "computed",
      sourceFile: "api/models/shopifyCustomer/wishlistCount.gelly",
      storageKey: "PEILOC7essS1",
    },
    wishlistItems: {
      type: "hasMany",
      children: { model: "wishlistItem", belongsToField: "customer" },
      storageKey: "eGd9HZNNVuls",
    },
    wishlists: {
      type: "hasMany",
      children: { model: "wishlist", belongsToField: "customer" },
      storageKey: "woP7H9DfLRzb",
    },
  },
  shopify: {
    fields: [
      "acceptsMarketing",
      "acceptsMarketingUpdatedAt",
      "currency",
      "dataSaleOptOut",
      "email",
      "emailMarketingConsent",
      "firstName",
      "lastName",
      "lastOrderName",
      "marketingOptInLevel",
      "metafield",
      "multipassIdentifier",
      "note",
      "ordersCount",
      "phone",
      "shop",
      "shopifyCreatedAt",
      "shopifyState",
      "shopifyUpdatedAt",
      "smsMarketingConsent",
      "statistics",
      "tags",
      "taxExempt",
      "taxExemptions",
      "totalSpent",
      "verifiedEmail",
    ],
  },
};
