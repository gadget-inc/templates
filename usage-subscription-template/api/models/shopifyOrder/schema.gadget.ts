import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyOrder" model, go to https://usage-subscription-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Order",
  fields: {},
  shopify: {
    fields: [
      "additionalFees",
      "billingAddress",
      "browserIp",
      "buyerAcceptsMarketing",
      "cancelReason",
      "cancellation",
      "cancelledAt",
      "cartToken",
      "checkoutToken",
      "clientDetails",
      "closedAt",
      "currency",
      "currentSubtotalPrice",
      "currentSubtotalPriceSet",
      "currentTotalAdditionalFeesSet",
      "currentTotalDiscounts",
      "currentTotalDiscountsSet",
      "currentTotalDutiesSet",
      "currentTotalPrice",
      "currentTotalPriceSet",
      "currentTotalTax",
      "currentTotalTaxSet",
      "customerLocale",
      "discountApplications",
      "discountCodes",
      "email",
      "estimatedTaxes",
      "financialStatus",
      "fulfillmentStatus",
      "landingSite",
      "merchantOfRecordAppId",
      "name",
      "note",
      "noteAttributes",
      "number",
      "orderNumber",
      "orderStatusUrl",
      "originalTotalAdditionalFeesSet",
      "originalTotalDutiesSet",
      "paymentGatewayNames",
      "phone",
      "poNumber",
      "presentmentCurrency",
      "processedAt",
      "referringSite",
      "shippingAddress",
      "shop",
      "shopifyCreatedAt",
      "shopifyProtect",
      "shopifyUpdatedAt",
      "sourceIdentifier",
      "sourceName",
      "sourceUrl",
      "subtotalPrice",
      "subtotalPriceSet",
      "tags",
      "taxExempt",
      "taxLines",
      "taxesIncluded",
      "test",
      "token",
      "totalDiscounts",
      "totalDiscountsSet",
      "totalLineItemsPrice",
      "totalLineItemsPriceSet",
      "totalOutstanding",
      "totalPrice",
      "totalPriceSet",
      "totalShippingPriceSet",
      "totalTax",
      "totalTaxSet",
      "totalTipReceived",
      "totalWeight",
    ],
  },
};
