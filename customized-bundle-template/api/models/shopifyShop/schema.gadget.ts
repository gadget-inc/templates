import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyShop" model, go to https://customized-bundle-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Shop",
  fields: {
    bundleComponentQuantitiesDefinitionId: {
      type: "string",
      storageKey: "D6yY6EmA8prx",
    },
    bundleComponents: {
      type: "hasMany",
      children: { model: "bundleComponent", belongsToField: "shop" },
      storageKey: "wb2GzqBcmURH",
    },
    bundleCount: {
      type: "computed",
      sourceFile: "api/models/shopifyShop/bundleCount.gelly",
      storageKey: "HMJDRQAMngDu",
    },
    bundles: {
      type: "hasMany",
      children: { model: "bundle", belongsToField: "shop" },
      storageKey: "5abwB6m2ta5F",
    },
    componentReferenceDefinitionId: {
      type: "string",
      storageKey: "QnkCNomT-PNu",
    },
    isBundleDefinitionId: {
      type: "string",
      storageKey: "74DalOPsAuLS",
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
      "productImages",
      "productVariants",
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
