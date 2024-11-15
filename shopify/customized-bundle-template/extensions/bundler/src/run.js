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
 * This is the very basic implementation of the expand function example that Shopify provides in their examples repo
 *
 * @returns {FunctionResult}
 */
export function run(input) {
  // Going through each line item to see if it's a bundle
  const operations = input.cart.lines.reduce(
    /** @param {CartOperation[]} acc */
    (acc, cartLine) => {
      // If the cart line has the metafields that specify the bundle parts, expand it
      const expandOperation = optionallyBuildExpandOperation(cartLine);

      // If there's an expand operation, add it to the list of operations
      if (expandOperation) {
        return [...acc, { expand: expandOperation }];
      }

      return acc;
    },
    []
  );

  // Return the list of operations if there are any, otherwise return NO_CHANGES
  return operations.length ? { operations } : NO_CHANGES;
}

// Function that accepts the cart line id and the merchandise object (variant, quantity, metafields)
function optionallyBuildExpandOperation({ id: cartLineId, merchandise }) {
  const hasExpandMetafields =
    !!merchandise.productVariantQuantities?.value &&
    !!merchandise.componentReference?.value;

  if (merchandise.__typename === "ProductVariant" && hasExpandMetafields) {
    // Parsing the metafields to get the variant ids and quantities
    const variants = JSON.parse(merchandise.componentReference.value);
    const quantities = JSON.parse(merchandise.productVariantQuantities.value);

    if (!variants.length) {
      throw new Error("Invalid bundle composition");
    }

    // Mapping the variants and quantities into an array of objects
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
