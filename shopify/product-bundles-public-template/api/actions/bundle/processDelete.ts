import type { ActionOptions } from "gadget-server";

export const options: ActionOptions = {
  timeoutMS: 30000,
};

type ProductDeleteResponse = {
  productDelete?: {
    deletedProductId?: string;
    userErrors?: { message: string }[];
  };
};

export const run: ActionRun = async ({ params, api, connections }) => {
  const { shopId, bundleId } = params;

  if (!shopId) throw new Error("Shop ID not provided");
  if (!bundleId) throw new Error("Bundle ID is required");

  const bundle = await api.shopifyProduct.findOne(bundleId, {
    select: {
      id: true,
      shopId: true,
    },
  });

  if (bundle.shopId !== shopId) {
    throw new Error("Bundle not found");
  }

  const shopify = await connections.shopify.forShopId(shopId);
  if (!shopify) throw new Error("Shopify connection not established");

  const productDeleteResponse = await shopify.graphql<ProductDeleteResponse>(
    `mutation DeleteBundleProduct($id: ID!) {
      productDelete(input: { id: $id }) {
        deletedProductId
        userErrors {
          message
        }
      }
    }`,
    {
      id: `gid://shopify/Product/${bundle.id}`,
    }
  );

  if (productDeleteResponse?.productDelete?.userErrors?.length) {
    throw new Error(productDeleteResponse.productDelete.userErrors[0].message);
  }

  const bundleVariant = await api.shopifyProductVariant.findFirst({
    filter: {
      productId: { equals: bundle.id },
      shopId: { equals: shopId },
    },
    select: { id: true },
  });

  if (bundleVariant) {
    await api.internal.bundleComponent.deleteMany({
      filter: {
        bundleVariantId: { equals: bundleVariant.id },
      },
    });
  }

  await api.internal.shopifyProduct.delete(bundle.id);

  return {
    bundleId: bundle.id,
  };
};

export const params = {
  bundleId: { type: "string" },
  shopId: { type: "string" },
};
