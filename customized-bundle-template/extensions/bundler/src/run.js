// @ts-check

/*
A straightforward example of a function that expands a bundle into its component parts.
The parts of a bundle are stored in a metafield on the product parent value with a specific format,
specifying each part's quantity and variant.

The function reads the cart. Any item containing the metafield that specifies the bundle parts
will return an Expand operation containing the parts.
*/

/**
 * @typedef {import("../generated/api").RunInput} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 * @typedef {import("../generated/api").CartOperation} CartOperation
 */

/**
 * @type {FunctionResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */
export function run(input) {
  const operations = input.cart.lines.reduce(
    /** @param {CartOperation[]} acc */
    (acc, cartLine) => {
      const expandOperation = optionallyBuildExpandOperation(cartLine);

      if (expandOperation) {
        return [...acc, { expand: expandOperation }];
      }

      return acc;
    },
    []
  );

  return operations.length ? { operations } : NO_CHANGES;
}

function optionallyBuildExpandOperation({ id: cartLineId, merchandise }) {
  const hasExpandMetafields =
    !!merchandise.productVariantQuantities?.value &&
    !!merchandise.componentReference?.value;

  if (merchandise.__typename === "ProductVariant" && hasExpandMetafields) {
    const variants = JSON.parse(merchandise.componentReference.value);
    const quantities = JSON.parse(merchandise.productVariantQuantities.value);

    if (!variants.length) {
      throw new Error("Invalid bundle composition");
    }

    const expandedCartItems = variants.map((merchandiseId) => ({
      merchandiseId,
      quantity:
        quantities[
          merchandiseId.replace(/gid:\/\/shopify\/ProductVariant\//g, "")
        ],
    }));

    if (expandedCartItems.length) {
      return { cartLineId, expandedCartItems };
    }
  }

  return null;
}
