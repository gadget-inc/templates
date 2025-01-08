import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyShop" model, go to https://product-quiz-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Shop",
  fields: {
    answers: {
      type: "hasMany",
      children: { model: "answer", belongsToField: "shop" },
      storageKey: "-8QjM60m5Tzg",
    },
    questions: {
      type: "hasMany",
      children: { model: "question", belongsToField: "shop" },
      storageKey: "0NNDucOuUPzh",
    },
    quizResults: {
      type: "hasMany",
      children: { model: "quizResult", belongsToField: "shop" },
      storageKey: "1dUcmA4xdhhU",
    },
    quizzes: {
      type: "hasMany",
      children: { model: "quiz", belongsToField: "shop" },
      storageKey: "O5wkGV3yXK7F",
    },
    recommendedProducts: {
      type: "hasMany",
      children: {
        model: "recommendedProduct",
        belongsToField: "shop",
      },
      storageKey: "rGVnQ8FbOdwP",
    },
    shopperSuggestions: {
      type: "hasMany",
      children: {
        model: "shopperSuggestion",
        belongsToField: "shop",
      },
      storageKey: "PQ9E4HBgynpF",
    },
  },
  shopify: {
    fields: [
      "address1",
      "address2",
      "assets",
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
      "themes",
      "timezone",
      "transactionalSmsDisabled",
      "weightUnit",
      "zipCode",
    ],
  },
};
