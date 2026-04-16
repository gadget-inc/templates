import { ActionOptions, deleteRecord } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({ params, record, api }) => {
  await preventCrossShopDataAccess(params, record);

  const [bundleVariant] = await api.shopifyProductVariant.findMany({
    first: 1,
    filter: {
      productId: { equals: record.id },
      shopId: { equals: record.shopId ?? undefined },
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

  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async ({ record, api, connections }) => {
  const shopify = connections.shopify.current;
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
      id: `gid://shopify/Product/${record.id}`,
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
};

export const options: ActionOptions = {
  actionType: "delete",
  triggers: { api: true },
};
