import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyShop" model, go to https://product-bundler-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Shop",
  fields: {
    bundleComponentQuantitiesDefinitionId: {
      type: "string",
      storageKey: "c58hV2tWdeYu",
    },
    bundleComponents: {
      type: "hasMany",
      children: { model: "bundleComponent", belongsToField: "shop" },
      storageKey: "lGpTsMpHlnab",
    },
    bundleCount: {
      type: "computed",
      sourceFile: "api/models/shopifyShop/bundleCount.gelly",
      storageKey: "trxoEj1chQDL",
    },
    bundles: {
      type: "hasMany",
      children: { model: "bundle", belongsToField: "shop" },
      storageKey: "kZHbCuyVIFvU",
    },
    componentReferenceDefinitionId: {
      type: "string",
      storageKey: "XFodaWDv9M0K",
    },
    isBundleDefinitionId: {
      type: "string",
      storageKey: "0uKSKqgrx20v",
    },
    onlineStorePublicationId: {
      type: "string",
      storageKey: "aLHENB_QfjCf",
    },
    weightUnitBackup: {
      type: "string",
      storageKey:
        "ModelField-DataModel-Shopify-Shop-weight_unit::FieldStorageEpoch-DataModel-Shopify-Shop-weight_unit-initial",
    },
  },
  shopify: {
    fields: [
      "address1",
      "address2",
      "alerts",
      "billingAddress",
      "checkoutApiSupported",
      "city",
      "countriesInShippingZones",
      "country",
      "countryCode",
      "countryName",
      "countyTaxes",
      "currency",
      "currencyFormats",
      "customerAccounts",
      "customerAccountsV2",
      "customerEmail",
      "description",
      "domain",
      "eligibleForPayments",
      "email",
      "enabledPresentmentCurrencies",
      "files",
      "finances",
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
      "orderNumberFormatPrefix",
      "orderNumberFormatSuffix",
      "passwordEnabled",
      "phone",
      "plan",
      "planDisplayName",
      "planName",
      "preLaunchEnabled",
      "primaryLocale",
      "productMedia",
      "productVariants",
      "products",
      "province",
      "provinceCode",
      "requiresExtraPaymentsAgreement",
      "resourceLimits",
      "richTextEdiorUrl",
      "setupRequired",
      "shipsToCountries",
      "shopOwner",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "source",
      "syncs",
      "taxShipping",
      "taxesIncluded",
      "taxesOffset",
      "timezone",
      "timezoneAbbreviation",
      "timezoneOffsetMinutes",
      "transactionalSmsDisabled",
      "unitSystem",
      "url",
      "weightUnit",
      "zipCode",
    ],
  },
};
