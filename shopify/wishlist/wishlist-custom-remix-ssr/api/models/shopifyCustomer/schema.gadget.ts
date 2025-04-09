import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyCustomer" model, go to https://wishlist-custom-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Customer",
  fields: {
    sendUpdateAt: {
      type: "dateTime",
      includeTime: true,
      storageKey: "uHbdn6VN_saV",
    },
    updateFrequencyOverride: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["unsubscribed", "weekly", "monthly", "quarterly"],
      storageKey: "W2yKDgyPohr4",
    },
    wishlistCount: {
      type: "computed",
      sourceFile: "api/models/shopifyCustomer/wishlistCount.gelly",
      storageKey: "r3RZ6GyWBFIo",
    },
    wishlistItems: {
      type: "hasMany",
      children: { model: "wishlistItem", belongsToField: "customer" },
      storageKey: "Qa8B1nVMC8I5",
    },
    wishlists: {
      type: "hasMany",
      children: { model: "wishlist", belongsToField: "customer" },
      storageKey: "dhxk158zfjuY",
    },
  },
  shopify: {
    fields: [
      "acceptsMarketing",
      "acceptsMarketingUpdatedAt",
      "amountSpent",
      "canDelete",
      "currency",
      "dataSaleOptOut",
      "displayName",
      "email",
      "emailMarketingConsent",
      "firstName",
      "hasTimelineComment",
      "lastName",
      "lastOrderName",
      "legacyResourceId",
      "lifetimeDuration",
      "locale",
      "marketingOptInLevel",
      "multipassIdentifier",
      "note",
      "numberOfOrders",
      "phone",
      "productSubscriberStatus",
      "shop",
      "shopifyCreatedAt",
      "shopifyState",
      "shopifyUpdatedAt",
      "smsMarketingConsent",
      "statistics",
      "tags",
      "taxExempt",
      "taxExemptions",
      "unsubscribeUrl",
      "validEmailAddress",
      "verifiedEmail",
    ],
  },
};
