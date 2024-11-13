import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyOrderLineItem" model, go to https://product-reviews-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-OrderLineItem",
  fields: {
    reviewCreated: { type: "boolean", storageKey: "-rQgABflj-nA" },
    reviews: {
      type: "hasMany",
      children: { model: "review", belongsToField: "lineItem" },
      storageKey: "eGcGDieaLQxN",
    },
  },
  shopify: {
    fields: [
      "attributedStaffs",
      "currentQuantity",
      "discountAllocations",
      "fulfillableQuantity",
      "fulfillmentService",
      "fulfillmentStatus",
      "giftCard",
      "grams",
      "name",
      "order",
      "price",
      "priceSet",
      "product",
      "productExists",
      "properties",
      "quantity",
      "requiresShipping",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "sku",
      "taxLines",
      "taxable",
      "title",
      "totalDiscount",
      "totalDiscountSet",
      "variantInventoryManagement",
      "variantTitle",
      "vendor",
    ],
  },
};
