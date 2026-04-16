import { deleteRecord, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({
  params,
  record,
  api,
}) => {
  await preventCrossShopDataAccess(params, record);

  // Delete all of this bundle's components
  await api.internal.bundleComponent.deleteMany({
    filter: {
      bundleId: {
        equals: record.id
      }
    }
  });

  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async ({
  record,
  api,
  connections,
}) => {
  const shopify = connections.shopify.current;

  if (!shopify) throw new Error("Shopify connection not established");
  if (!record.bundleVariantId) throw new Error("Bundle variant ID not found");

  const variant = await api.shopifyProductVariant.maybeFindOne(record.bundleVariantId, {
    select: {
      productId: true,
    },
  });

  if (!variant?.productId) throw new Error("Bundle variant not found");

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
      id: `gid://shopify/Product/${variant.productId}`,
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
};
