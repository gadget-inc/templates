import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyShop" model, go to https://product-quiz-public-rrv7-d.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Shop",
  fields: {
    answers: {
      type: "hasMany",
      children: { model: "answer", belongsToField: "shop" },
      storageKey: "GtDgH9gzuIpy",
    },
    questions: {
      type: "hasMany",
      children: { model: "question", belongsToField: "shop" },
      storageKey: "2mr-H0G81tD4",
    },
    quizResults: {
      type: "hasMany",
      children: { model: "quizResult", belongsToField: "shop" },
      storageKey: "t70Jcp2Uq1TJ",
    },
    quizzes: {
      type: "hasMany",
      children: { model: "quiz", belongsToField: "shop" },
      storageKey: "6Yk0KUiy8Y9_",
    },
    recommendedProducts: {
      type: "hasMany",
      children: {
        model: "recommendedProduct",
        belongsToField: "shop",
      },
      storageKey: "VJk5tX3zptpJ",
    },
    shopperSuggestions: {
      type: "hasMany",
      children: {
        model: "shopperSuggestion",
        belongsToField: "shop",
      },
      storageKey: "ALXrzdZGah9j",
    },
  },
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
