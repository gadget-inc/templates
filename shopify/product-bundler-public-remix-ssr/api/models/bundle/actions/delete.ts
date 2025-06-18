import { deleteRecord, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  await preventCrossShopDataAccess(params, record);

  const shopify = connections.shopify.current;

  if (!shopify) throw new Error("Shopify connection not established");
  if (!record.bundleVariantId) throw new Error("Bundle variant ID not found");

  // Fetch the bundle's parent product variant
  const variant = await api.shopifyProductVariant.maybeFindOne(
    record.bundleVariantId,
    {
      select: {
        productId: true,
      },
    }
  );

  if (!variant || !variant.productId)
    throw new Error("Bundle variant not found");

  // Delete the product on the Shopify store
  const response = await shopify.graphql(`
    mutation {
      productDelete(input: {id: "gid://shopify/Product/${variant.productId}"}) {
        deletedProductId
        userErrors {
          message
        }
      }
    }`
  );

  if (response?.productDelete?.userErrors?.length) throw new Error(response.productDelete.userErrors[0].message);

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

export const options: ActionOptions = {
  actionType: "delete",
};
