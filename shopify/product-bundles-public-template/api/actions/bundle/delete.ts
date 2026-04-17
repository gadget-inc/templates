export const run: GlobalActionRun = async ({ params, api, connections }) => {
  const shopId = String(connections.shopify.currentShop?.id ?? "");
  if (!shopId) throw new Error("Shop ID not provided");

  const { bundleId } = params as {
    bundleId?: string;
  };

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

  const [bundleVariant] = await api.shopifyProductVariant.findMany({
    first: 1,
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

  const shopify = await connections.shopify.forShopId(shopId);
  if (!shopify) throw new Error("Shopify connection not established");

  const productDeleteHandle = await api.enqueue(shopify.graphql, {
    query: `mutation DeleteBundleProduct($id: ID!) {
      productDelete(input: { id: $id }) {
        deletedProductId
        userErrors {
          message
        }
      }
    }`,
    variables: {
      id: `gid://shopify/Product/${bundle.id}`,
    },
  });

  const productDeleteResponse = (await productDeleteHandle.result()) as {
    productDelete?: {
      deletedProductId?: string;
      userErrors?: { message: string }[];
    };
  };

  if (productDeleteResponse?.productDelete?.userErrors?.length) {
    throw new Error(productDeleteResponse.productDelete.userErrors[0].message);
  }

  return {
    bundleId: bundle.id,
  };
};

export const params = {
  bundleId: { type: "string" },
};
