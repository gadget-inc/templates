import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyShop" model, go to https://product-bundles-public-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "DataModel-Shopify-Shop",
  fields: {
    bundleComponentQuantitiesDefinitionId: {
      type: "string",
      storageKey: "1WHTlv4q5utu",
    },
    bundleComponents: {
      type: "hasMany",
      children: { model: "bundleComponent", belongsToField: "shop" },
      storageKey: "oxeE9cyqBfSA",
    },
    componentReferenceDefinitionId: {
      type: "string",
      storageKey: "yDcEPU5-3toU",
    },
    isBundleDefinitionId: {
      type: "string",
      storageKey: "sHZJfYZ0dK4C",
    },
    onlineStorePublicationId: {
      type: "string",
      storageKey: "LGqw4JFnd4WG",
    },
  },
  shopify: {
    fields: {
      address1: { filterIndex: false },
      address2: { filterIndex: false },
      checkoutApiSupported: {
        filterIndex: false,
        searchIndex: false,
      },
      city: { filterIndex: false },
      country: { filterIndex: false },
      countryCode: { filterIndex: false },
      countryName: { filterIndex: false },
      countyTaxes: { filterIndex: false, searchIndex: false },
      currency: { filterIndex: false, searchIndex: false },
      customerEmail: { filterIndex: false },
      domain: true,
      eligibleForPayments: { filterIndex: false, searchIndex: false },
      email: { filterIndex: false },
      enabledPresentmentCurrencies: {
        filterIndex: false,
        searchIndex: false,
      },
      files: true,
      finances: { filterIndex: false, searchIndex: false },
      gdprRequests: true,
      googleAppsDomain: { filterIndex: false, searchIndex: false },
      googleAppsLoginEnabled: {
        filterIndex: false,
        searchIndex: false,
      },
      hasDiscounts: { filterIndex: false, searchIndex: false },
      hasGiftCards: { filterIndex: false, searchIndex: false },
      hasStorefront: { filterIndex: false, searchIndex: false },
      ianaTimezone: { filterIndex: false, searchIndex: false },
      latitude: { filterIndex: false, searchIndex: false },
      longitude: { filterIndex: false, searchIndex: false },
      marketingSmsContentEnabledAtCheckout: {
        filterIndex: false,
        searchIndex: false,
      },
      moneyFormat: { filterIndex: false, searchIndex: false },
      moneyInEmailsFormat: { filterIndex: false, searchIndex: false },
      moneyWithCurrencyFormat: {
        filterIndex: false,
        searchIndex: false,
      },
      moneyWithCurrencyInEmailsFormat: {
        filterIndex: false,
        searchIndex: false,
      },
      multiLocationEnabled: {
        filterIndex: false,
        searchIndex: false,
      },
      myshopifyDomain: true,
      name: true,
      passwordEnabled: { filterIndex: false, searchIndex: false },
      phone: { filterIndex: false },
      planDisplayName: true,
      planName: true,
      preLaunchEnabled: { filterIndex: false, searchIndex: false },
      primaryLocale: { filterIndex: false, searchIndex: false },
      productMedia: true,
      productVariants: true,
      products: true,
      province: { filterIndex: false },
      provinceCode: { filterIndex: false },
      requiresExtraPaymentsAgreement: {
        filterIndex: false,
        searchIndex: false,
      },
      setupRequired: { filterIndex: false, searchIndex: false },
      shopOwner: { filterIndex: false },
      shopifyCreatedAt: { filterIndex: false, searchIndex: false },
      shopifyUpdatedAt: { filterIndex: false, searchIndex: false },
      source: { filterIndex: false, searchIndex: false },
      syncs: true,
      taxShipping: { filterIndex: false, searchIndex: false },
      taxesIncluded: { filterIndex: false, searchIndex: false },
      timezone: { filterIndex: false, searchIndex: false },
      transactionalSmsDisabled: {
        filterIndex: false,
        searchIndex: false,
      },
      weightUnit: { filterIndex: false, searchIndex: false },
      zipCode: { filterIndex: false, searchIndex: false },
    },
  },
};
