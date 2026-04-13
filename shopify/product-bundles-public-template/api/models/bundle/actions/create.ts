import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { fetchVariantGIDs } from "../../../utils";

export const run: ActionRun = async ({
  params,
  record,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  record,
  api,
  connections,
}) => {
  const shopId = String(connections.shopify.currentShop?.id ?? record.shopId ?? "");

  if (!shopId) throw new Error("Shop ID not provided");
  if (
    !record.id ||
    !record.status ||
    !record.title ||
    record.description === undefined ||
    record.price === undefined
  ) {
    throw new Error("Bundle properties not provided");
  }

  const shopify = await connections.shopify.forShopId(shopId);

  if (!shopify) throw new Error("Shopify connection not established");

  const productCreateHandle = await api.enqueue(shopify.graphql, {
    query: `mutation CreateBundleProduct($productInput: ProductCreateInput!) {
      productCreate(product: $productInput) {
        product {
          id
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }`,
    variables: {
      productInput: {
        status: record.status.toUpperCase(),
        title: record.title,
        descriptionHtml: record.description,
        claimOwnership: {
          bundles: true,
        },
      },
    },
  });

  const productCreateResponse = (await productCreateHandle.result()) as {
    productCreate?: {
      product?: {
        id?: string;
        variants?: { edges?: { node?: { id?: string } }[] };
      };
      userErrors?: { field?: string[]; message: string }[];
    };
  };

  if (productCreateResponse?.productCreate?.userErrors?.length) {
    throw new Error(productCreateResponse.productCreate.userErrors[0].message);
  }

  const bundleComponents = await api.bundleComponent.findMany({
    filter: {
      bundleId: { equals: record.id },
      shopId: { equals: shopId },
    },
    select: {
      productVariantId: true,
      quantity: true,
    },
  });

  const quantityByVariantId = Object.fromEntries(
    bundleComponents
      .filter((bundleComponent) => bundleComponent.productVariantId)
      .map((bundleComponent) => [
        bundleComponent.productVariantId as string,
        bundleComponent.quantity ?? 0,
      ])
  );

  const variantGIDs = await fetchVariantGIDs(record.id, shopId);

  const productVariantUpdateHandle = await api.enqueue(shopify.graphql, {
    query: `mutation UpdateBundleVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors {
          message
        }
      }
    }`,
    variables: {
      productId: productCreateResponse.productCreate?.product?.id,
      variants: [
        {
          id: productCreateResponse.productCreate?.product?.variants?.edges?.[0]?.node?.id,
          price: record.price.toFixed(2),
          inventoryPolicy: "CONTINUE",
          metafields: [
            {
              namespace: "bundle",
              key: "componentReference",
              type: "list.variant_reference",
              value: JSON.stringify(variantGIDs),
            },
            {
              namespace: "bundle",
              key: "isBundle",
              type: "boolean",
              value: "true",
            },
            {
              namespace: "bundle",
              key: "productVariantQuantities",
              type: "json",
              value: JSON.stringify(quantityByVariantId),
            },
          ],
          requiresComponents: true,
        },
      ],
    },
  });

  const productVariantUpdateResponse = (await productVariantUpdateHandle.result()) as {
    productVariantsBulkUpdate?: {
      userErrors?: { message: string }[];
    };
  };

  if (productVariantUpdateResponse?.productVariantsBulkUpdate?.userErrors?.length) {
    throw new Error(productVariantUpdateResponse.productVariantsBulkUpdate.userErrors[0].message);
  }

  const shop = await api.shopifyShop.findOne(shopId, {
    select: {
      onlineStorePublicationId: true,
    },
  });

  if (shop.onlineStorePublicationId) {
    const publicationHandle = await api.enqueue(shopify.graphql, {
      query: `mutation PublishBundle($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          userErrors {
            message
          }
        }
      }`,
      variables: {
        id: productCreateResponse.productCreate?.product?.id,
        input: [{ publicationId: shop.onlineStorePublicationId }],
      },
    });

    const publicationResponse = (await publicationHandle.result()) as {
      publishablePublish?: {
        userErrors?: { message: string }[];
      };
    };

    if (publicationResponse?.publishablePublish?.userErrors?.length) {
      throw new Error(publicationResponse.publishablePublish.userErrors[0].message);
    }
  }

  const bundleVariantGid = productCreateResponse.productCreate?.product?.variants?.edges?.[0]?.node?.id;
  const bundleVariantId = bundleVariantGid?.split("/")[4];

  if (!bundleVariantId) throw new Error("Failed to determine bundle variant ID");

  await api.internal.bundle.update(record.id, {
    bundleVariant: {
      _link: bundleVariantId,
    },
  });
};

export const options: ActionOptions = {
  actionType: "create",
};
