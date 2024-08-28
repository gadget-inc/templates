import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProductVariant" model, go to https://wishlist-template.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-ProductVariant",
  fields: {
    customersToEmail: {
      type: "json",
      default: {},
      validations: { required: true },
      storageKey: "Ij59EyhVp-Nz",
    },
    deleted: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey: "EnHK4gT9Oinu",
    },
    wishlists: {
      type: "hasManyThrough",
      sibling: { model: "wishlist", relatedField: "variants" },
      join: {
        model: "wishlistItem",
        belongsToSelfField: "variant",
        belongsToSiblingField: "wishlist",
      },
      storageKey: "LLgiSLrXdYPj",
    },
  },
  shopify: {
    fields: [
      "barcode",
      "compareAtPrice",
      "inventoryPolicy",
      "inventoryQuantity",
      "option1",
      "option2",
      "option3",
      "position",
      "presentmentPrices",
      "price",
      "product",
      "productImage",
      "selectedOptions",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "sku",
      "taxCode",
      "taxable",
      "title",
    ],
  },
};
