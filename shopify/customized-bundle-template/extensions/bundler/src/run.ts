import type {
  RunInput,
  FunctionRunResult,
  CartOperation,
  ExpandOperation,
} from "../generated/api";

type ProductVariant = {
  __typename: "ProductVariant";
  id: string;
  componentReference?: { value: string | null };
  productVariantQuantities?: { value: string | null };
};

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
  // Going through each line item to see if it's a bundle
  const operations = input.cart.lines.reduce(
    (acc: CartOperation[], cartLine) => {
      // If the cart line has the metafields that specify the bundle parts, expand it
      const expandOperation: ExpandOperation | null =
        optionallyBuildExpandOperation(cartLine);

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
function optionallyBuildExpandOperation({
  id: cartLineId,
  merchandise,
}: {
  id: string;
  merchandise?: ProductVariant;
}): {
  cartLineId: string;
  expandedCartItems: { merchandiseId: string; quantity: number }[];
} | null {
  const hasExpandMetafields =
    !!merchandise?.productVariantQuantities?.value &&
    !!merchandise?.componentReference?.value;

  if (merchandise?.__typename === "ProductVariant" && hasExpandMetafields) {
    // Parsing the metafields to get the variant ids and quantities
    const variants = JSON.parse(merchandise.componentReference?.value || "[]");
    const quantities = JSON.parse(
      merchandise.productVariantQuantities?.value || "{}"
    );

    if (!variants.length) {
      throw new Error("Invalid bundle composition");
    }

    // Mapping the variants and quantities into an array of objects
    const expandedCartItems = variants.map((merchandiseId: string) => ({
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
