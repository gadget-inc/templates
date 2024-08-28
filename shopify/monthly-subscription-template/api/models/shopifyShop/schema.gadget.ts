import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyShop" model, go to https://monthly-subscription-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Shop",
  fields: {
    activeRecurringSubscriptionId: {
      type: "string",
      storageKey:
        "ModelField-IRflMDuEImhc::FieldStorageEpoch-HI3lbaqUSIsk",
    },
    confirmationUrl: {
      type: "string",
      storageKey:
        "ModelField-t6nGoSM19dmU::FieldStorageEpoch-wySQwFmfJG8I",
    },
    plan: {
      type: "belongsTo",
      parent: { model: "plan" },
      storageKey:
        "ModelField-Bi00x7SyvTHq::FieldStorageEpoch-Gd-lzXsH76jv",
    },
    usedTrialMinutes: {
      type: "number",
      default: 0,
      validations: { required: true },
      storageKey:
        "ModelField-hSk98OiQOe6_::FieldStorageEpoch-PH3XHUet_0D6",
    },
    usedTrialMinutesUpdatedAt: {
      type: "dateTime",
      includeTime: true,
      storageKey:
        "ModelField-HWITdpCxPri5::FieldStorageEpoch-CEHymoOmdrhp",
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
