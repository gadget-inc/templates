import { describe, expect, it } from "vitest";
import { cartTransformRun } from "../src/cart_transform_run";

describe("cartTransformRun", () => {
  it("returns no operations when the cart contains no bundles", () => {
    expect(
      cartTransformRun({
        cart: {
          lines: [
            {
              id: "gid://shopify/CartLine/1",
              quantity: 1,
            },
          ],
        },
      }),
    ).toEqual({ operations: [] });
  });

  it("expands bundle lines using the variant metafields", () => {
    expect(
      cartTransformRun({
        cart: {
          lines: [
            {
              id: "gid://shopify/CartLine/1",
              quantity: 1,
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/100",
                componentReference: {
                  value: JSON.stringify([
                    "gid://shopify/ProductVariant/200",
                    "gid://shopify/ProductVariant/300",
                  ]),
                },
                productVariantQuantities: {
                  value: JSON.stringify({
                    "200": 2,
                    "300": 1,
                  }),
                },
              },
            },
          ],
        },
      }),
    ).toEqual({
      operations: [
        {
          expand: {
            cartLineId: "gid://shopify/CartLine/1",
            expandedCartItems: [
              {
                merchandiseId: "gid://shopify/ProductVariant/200",
                quantity: 2,
              },
              {
                merchandiseId: "gid://shopify/ProductVariant/300",
                quantity: 1,
              },
            ],
          },
        },
      ],
    });
  });

  it("throws for invalid bundle definitions", () => {
    expect(() =>
      cartTransformRun({
        cart: {
          lines: [
            {
              id: "gid://shopify/CartLine/1",
              quantity: 1,
              merchandise: {
                __typename: "ProductVariant",
                id: "gid://shopify/ProductVariant/100",
                componentReference: {
                  value: JSON.stringify([]),
                },
                productVariantQuantities: {
                  value: JSON.stringify({}),
                },
              },
            },
          ],
        },
      }),
    ).toThrow("Invalid bundle composition");
  });
});
