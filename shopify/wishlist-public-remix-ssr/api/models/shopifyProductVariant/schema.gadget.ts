import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProductVariant" model, go to https://wishlist-public-remix-ssr.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-ProductVariant",
  fields: {
    customersToEmail: {
      type: "json",
      default: {},
      validations: { required: true },
      storageKey: "p5NTevcXxlAh",
    },
    deleted: {
      type: "boolean",
      default: false,
      storageKey: "NbL2TKDqgxIP",
    },
    wishlists: {
      type: "hasManyThrough",
      sibling: { model: "wishlist", relatedField: "variants" },
      join: {
        model: "wishlistItem",
        belongsToSelfField: "variant",
        belongsToSiblingField: "wishlist",
      },
      storageKey: "FXh1_Onead_3",
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
