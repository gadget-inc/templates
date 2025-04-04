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
    checkoutApiSupportedBackup: {
      type: "boolean",
      storageKey:
        "ModelField-DataModel-Shopify-Shop-checkout_api_supported::FieldStorageEpoch-DataModel-Shopify-Shop-checkout_api_supported-initial",
    },
    componentReferenceDefinitionId: {
      type: "string",
      storageKey: "XFodaWDv9M0K",
    },
    cookieConsentLevel: {
      type: "string",
      storageKey:
        "ModelField-DataModel-Shopify-Shop-cookie_consent_level::FieldStorageEpoch-DataModel-Shopify-Shop-cookie_consent_level-initial",
    },
    currencyBackup: {
      type: "string",
      storageKey:
        "ModelField-DataModel-Shopify-Shop-currency::FieldStorageEpoch-DataModel-Shopify-Shop-currency-initial",
    },
    eligibleForCardReaderGiveaway: {
      type: "boolean",
      storageKey:
        "ModelField-DataModel-Shopify-Shop-eligible_for_card_reader_giveaway::FieldStorageEpoch-DataModel-Shopify-Shop-eligible_for_card_reader_giveaway-initial",
    },
    enabledPresentmentCurrenciesBackup: {
      type: "json",
      storageKey:
        "ModelField-DataModel-Shopify-Shop-enabled_presentment_currencies::FieldStorageEpoch-DataModel-Shopify-Shop-enabled_presentment_currencies-initial",
    },
    forceSsl: {
      type: "boolean",
      storageKey:
        "ModelField-DataModel-Shopify-Shop-force_ssl::FieldStorageEpoch-DataModel-Shopify-Shop-force_ssl-initial",
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
