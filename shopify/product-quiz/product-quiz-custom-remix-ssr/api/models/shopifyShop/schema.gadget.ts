import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyShop" model, go to https://product-quiz-custom-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Shop",
  fields: {},
  shopify: {
    fields: [
      "address1",
      "address2",
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
      "files",
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
      "plan",
      "planDisplayName",
      "planName",
      "preLaunchEnabled",
      "primaryLocale",
      "productMedia",
      "products",
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
