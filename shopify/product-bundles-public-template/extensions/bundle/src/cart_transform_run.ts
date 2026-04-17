import type {
  CartTransformRunInput,
  CartTransformRunResult,
  CartOperation,
  ExpandOperation,
} from "../generated/api";

type BundleProductVariant = {
  __typename: "ProductVariant";
  id: string;
  componentReference?: { value?: string | null } | null;
  productVariantQuantities?: { value?: string | null } | null;
};

type BundleCartLine = {
  id: string;
  merchandise?: BundleProductVariant;
};

const NO_CHANGES: CartTransformRunResult = {
  operations: [],
};

export function cartTransformRun(input: CartTransformRunInput): CartTransformRunResult {
  const operations = (input.cart.lines as BundleCartLine[]).reduce(
    (acc: CartOperation[], cartLine) => {
      const expandOperation = optionallyBuildExpandOperation({
        id: cartLine.id,
        merchandise:
          cartLine.merchandise?.__typename === "ProductVariant"
            ? cartLine.merchandise
            : undefined,
      });

      if (expandOperation) {
        return [...acc, { lineExpand: expandOperation }];
      }

      return acc;
    },
    [],
  );

  return operations.length ? { operations } : NO_CHANGES;
}

function optionallyBuildExpandOperation({
  id: cartLineId,
  merchandise,
}: {
  id: string;
  merchandise?: BundleProductVariant;
}): ExpandOperation | null {
  const hasExpandMetafields =
    !!merchandise?.componentReference?.value &&
    !!merchandise?.productVariantQuantities?.value;

  if (!hasExpandMetafields) return null;

  const variants = JSON.parse(merchandise.componentReference?.value || "[]");
  const quantities = JSON.parse(merchandise.productVariantQuantities?.value || "{}");

  if (!Array.isArray(variants) || !variants.length) {
    throw new Error("Invalid bundle composition");
  }

  const expandedCartItems = variants.map((merchandiseId: string) => ({
    merchandiseId,
    quantity:
      quantities[merchandiseId.replace(/gid:\/\/shopify\/ProductVariant\//g, "")],
  }));

  return expandedCartItems.length
    ? { cartLineId, expandedCartItems }
    : null;
}
