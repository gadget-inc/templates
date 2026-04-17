import type { ActionOptions } from "gadget-server";

type ComponentParam = {
  productVariantId: string;
  quantity: number;
};

type ProcessCreateParams = {
  shopId?: string;
  title?: string;
  description?: string | null;
  status?: string;
  price?: number;
  components?: ComponentParam[];
};

type ProductCreateResponse = {
  productCreate?: {
    product?: {
      id?: string;
      variants?: { edges?: { node?: { id?: string } }[] };
    };
    userErrors?: { field?: string[]; message: string }[];
  };
};

type ProductVariantsBulkUpdateResponse = {
  productVariantsBulkUpdate?: {
    userErrors?: { message: string }[];
  };
};

type PublishablePublishResponse = {
  publishablePublish?: {
    userErrors?: { message: string }[];
  };
};

export const options: ActionOptions = {
  timeoutMS: 30000,
};

export const run: ActionRun = async ({ params, api, connections }) => {
  const { shopId, title, description, status, price, components } = params as ProcessCreateParams;

  if (!shopId) throw new Error("Shop ID not provided");
  if (!title) throw new Error("Title is required");
  if (!status) throw new Error("Status is required");
  if (price === undefined || price === null) throw new Error("Price is required");

  const shopify = await connections.shopify.forShopId(shopId);
  if (!shopify) throw new Error("Shopify connection not established");

  const componentList = components ?? [];
  const variantGIDs = componentList.map(
    (component) => `gid://shopify/ProductVariant/${component.productVariantId}`
  );
  const quantityByVariantId: Record<string, number> = {};
  for (const component of componentList) {
    quantityByVariantId[component.productVariantId] = component.quantity;
  }

  const productCreateResponse = await shopify.graphql<ProductCreateResponse>(
    `mutation CreateBundleProduct($productInput: ProductCreateInput!) {
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
    {
      productInput: {
        status: status.toUpperCase(),
        title,
        descriptionHtml: description ?? "",
        claimOwnership: {
          bundles: true,
        },
      },
    }
  );

  if (productCreateResponse?.productCreate?.userErrors?.length) {
    throw new Error(productCreateResponse.productCreate.userErrors[0].message);
  }

  const productGid = productCreateResponse.productCreate?.product?.id;
  const bundleVariantGid =
    productCreateResponse.productCreate?.product?.variants?.edges?.[0]?.node?.id;
  const productId = productGid?.split("/").pop();
  const bundleVariantId = bundleVariantGid?.split("/").pop();

  if (!productGid || !productId) throw new Error("Failed to determine product ID");
  if (!bundleVariantGid || !bundleVariantId) throw new Error("Failed to determine bundle variant ID");

  const productVariantUpdateResponse = await shopify.graphql<ProductVariantsBulkUpdateResponse>(
    `mutation UpdateBundleVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors {
          message
        }
      }
    }`,
    {
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
    }
  );

  if (productVariantUpdateResponse?.productVariantsBulkUpdate?.userErrors?.length) {
    throw new Error(productVariantUpdateResponse.productVariantsBulkUpdate.userErrors[0].message);
  }

  const shop = await api.shopifyShop.findOne(shopId, {
    select: {
      onlineStorePublicationId: true,
    },
  });

  if (shop.onlineStorePublicationId) {
    const publicationResponse = await shopify.graphql<PublishablePublishResponse>(
      `mutation PublishBundle($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          userErrors {
            message
          }
        }
      }`,
      {
        id: productGid,
        input: [{ publicationId: shop.onlineStorePublicationId }],
      }
    );

    if (publicationResponse?.publishablePublish?.userErrors?.length) {
      throw new Error(publicationResponse.publishablePublish.userErrors[0].message);
    }
  }

  await Promise.all(
    componentList.map((component) =>
      api.internal.bundleComponent.create({
        bundleVariant: { _link: bundleVariantId },
        productVariant: { _link: component.productVariantId },
        quantity: component.quantity,
        shop: { _link: shopId },
      })
    )
  );

  return {
    productId,
    bundleVariantId,
  };
};

export const params = {
  shopId: { type: "string" },
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
