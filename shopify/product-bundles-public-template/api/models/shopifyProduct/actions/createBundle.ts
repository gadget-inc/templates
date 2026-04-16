import { ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

type ComponentParam = {
  productVariantId: string;
  quantity: number;
};

export const run: ActionRun = async ({ params, record }) => {
  await preventCrossShopDataAccess(params, record);

  const { title, status, price } = params as {
    title?: string;
    status?: string;
    price?: number;
  };

  if (!title) throw new Error("Title is required");
  if (!status) throw new Error("Status is required");
  if (price === undefined || price === null) throw new Error("Price is required");
};

export const onSuccess: ActionOnSuccess = async ({ params, api, connections }) => {
  const shopId = String(connections.shopify.currentShop?.id ?? "");
  if (!shopId) throw new Error("Shop ID not provided");

  const { title, description, status, price, components } = params as {
    title: string;
    description?: string | null;
    status: string;
    price: number;
    components?: ComponentParam[];
  };

  const shopify = await connections.shopify.forShopId(shopId);
  if (!shopify) throw new Error("Shopify connection not established");

  const componentList = components ?? [];
  const variantGIDs = componentList.map(
    (c) => `gid://shopify/ProductVariant/${c.productVariantId}`
  );
  const quantityByVariantId: Record<string, number> = {};
  for (const c of componentList) {
    quantityByVariantId[c.productVariantId] = c.quantity;
  }

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
        status: status.toUpperCase(),
        title,
        descriptionHtml: description ?? "",
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

  const productGid = productCreateResponse.productCreate?.product?.id;
  const bundleVariantGid = productCreateResponse.productCreate?.product?.variants?.edges?.[0]?.node?.id;
  const bundleVariantId = bundleVariantGid?.split("/")[4];

  if (!productGid) throw new Error("Failed to determine product ID");
  if (!bundleVariantGid || !bundleVariantId) throw new Error("Failed to determine bundle variant ID");

  const productVariantUpdateHandle = await api.enqueue(shopify.graphql, {
    query: `mutation UpdateBundleVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors {
          message
        }
      }
    }`,
    variables: {
      productId: productGid,
      variants: [
        {
          id: bundleVariantGid,
          price: price.toFixed(2),
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
        id: productGid,
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

  for (const component of componentList) {
    await api.internal.bundleComponent.create({
      bundleVariant: { _link: bundleVariantId },
      productVariant: { _link: component.productVariantId },
      quantity: component.quantity,
      shop: { _link: shopId },
    });
  }
};

export const params = {
  title: { type: "string" },
  description: { type: "string" },
  status: { type: "string" },
  price: { type: "number" },
  components: {
    type: "array",
    items: {
      type: "object",
      properties: {
        productVariantId: { type: "string" },
        quantity: { type: "number" },
      },
    },
  },
};

export const options: ActionOptions = {
  actionType: "create",
  triggers: { api: true },
};
