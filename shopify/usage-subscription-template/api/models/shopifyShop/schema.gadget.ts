import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyShop" model, go to https://usage-subscription-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Shop",
  fields: {
    activeSubscriptionId: {
      type: "string",
      storageKey:
        "ModelField-IRflMDuEImhc::FieldStorageEpoch-HI3lbaqUSIsk",
    },
    amountUsedInPeriod: {
      type: "computed",
      sourceFile: "api/models/shopifyShop/amountUsedInPeriod.gelly",
      storageKey:
        "ModelField-WKWjwgZqZ8HL::FieldStorageEpoch-gR6uSHuO9xVb",
    },
    billingPeriodEnd: {
      type: "dateTime",
      includeTime: true,
      storageKey:
        "ModelField-CifoxUvL1sr5::FieldStorageEpoch-l5qJjDvEk69o",
    },
    billingPeriodStart: {
      type: "dateTime",
      includeTime: true,
      storageKey:
        "ModelField-4W_6KW7bjUEE::FieldStorageEpoch-0F-VYmzrqNbd",
    },
    confirmationUrl: {
      type: "string",
      storageKey:
        "ModelField-t6nGoSM19dmU::FieldStorageEpoch-wySQwFmfJG8I",
    },
    inTrial: {
      type: "computed",
      sourceFile: "api/models/shopifyShop/inTrial.gelly",
      storageKey:
        "ModelField-Kox8tYglkm_R::FieldStorageEpoch-3_AsCp5B4Wc-",
    },
    overage: {
      type: "number",
      default: 0,
      validations: {
        required: true,
        numberRange: { min: 0, max: null },
      },
      storageKey:
        "ModelField-8KbRavy8GYN6::FieldStorageEpoch-gR4MRKXx7p8p",
    },
    plan: {
      type: "belongsTo",
      parent: { model: "plan" },
      storageKey:
        "ModelField-Bi00x7SyvTHq::FieldStorageEpoch-Gd-lzXsH76jv",
    },
    trialStartedAt: {
      type: "dateTime",
      includeTime: true,
      storageKey:
        "ModelField-HWITdpCxPri5::FieldStorageEpoch-CEHymoOmdrhp",
    },
    usagePlanId: {
      type: "string",
      storageKey:
        "ModelField-X1Aw6-DOB6GY::FieldStorageEpoch-t8vS89rLzGV-",
    },
    usageRecords: {
      type: "hasMany",
      children: { model: "usageRecord", belongsToField: "shop" },
      storageKey:
        "ModelField-AU3Eaw5sCAI-::FieldStorageEpoch-T_DhH-fagea3",
    },
    usedTrialMinutes: {
      type: "number",
      default: 0,
      validations: { required: true },
      storageKey:
        "ModelField-hSk98OiQOe6_::FieldStorageEpoch-PH3XHUet_0D6",
    },
  },
  shopify: {
    fields: [
      "address1",
      "address2",
      "appSubscriptions",
      "checkoutApiSupported",
      "city",
      "cookieConsentLevel",
      "country",
      "countryCode",
      "countryName",
      "countyTaxes",
      "currency",
      "customerAccountsV2",
      "customerEmail",
      "domain",
      "eligibleForCardReaderGiveaway",
      "eligibleForPayments",
      "email",
      "enabledPresentmentCurrencies",
      "finances",
      "forceSsl",
      "gdprRequests",
      "googleAppsDomain",
      "googleAppsLoginEnabled",
      "hasDiscounts",
      "hasGiftCards",
      "hasStorefront",
      "ianaTimezone",
      "latitude",
      "longitude",
      "marketingSmsContentEnabledAtCheckout",
      "moneyFormat",
      "moneyInEmailsFormat",
      "moneyWithCurrencyFormat",
      "moneyWithCurrencyInEmailsFormat",
      "multiLocationEnabled",
      "myshopifyDomain",
      "name",
      "orders",
      "passwordEnabled",
      "phone",
      "planDisplayName",
      "planName",
      "preLaunchEnabled",
      "primaryLocale",
      "province",
      "provinceCode",
      "requiresExtraPaymentsAgreement",
      "setupRequired",
      "shopOwner",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "source",
      "syncs",
      "taxShipping",
      "taxesIncluded",
      "timezone",
      "transactionalSmsDisabled",
      "weightUnit",
      "zipCode",
    ],
  },
};
