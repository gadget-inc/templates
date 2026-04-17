type ComponentParam = {
  productVariantId: string;
  quantity: number;
};

export const run: GlobalActionRun = async ({ params, api, connections }) => {
  const shopId = String(connections.shopify.currentShop?.id ?? "");
  if (!shopId) throw new Error("Shop ID not provided");

  const { title, description, status, price, components } = params as {
    title: string;
    description?: string | null;
    status: string;
    price: number;
    components?: ComponentParam[];
  };

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
  const bundleVariantGid =
    productCreateResponse.productCreate?.product?.variants?.edges?.[0]?.node?.id;
  const productId = productGid?.split("/").pop();
  const bundleVariantId = bundleVariantGid?.split("/").pop();

  if (!productGid || !productId) throw new Error("Failed to determine product ID");
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

  return {
    productId,
    bundleVariantId,
  };
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
