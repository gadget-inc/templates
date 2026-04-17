import { fetchVariantGIDs } from "../../utils";

type ComponentParam = {
  id?: string;
  productVariantId: string;
  quantity: number;
};

export const run: GlobalActionRun = async ({ params, api, connections }) => {
  const shopId = String(connections.shopify.currentShop?.id ?? "");
  if (!shopId) throw new Error("Shop ID not provided");

  const { bundleId, title, description, status, price, components } = params as {
    bundleId?: string;
    title?: string;
    description?: string | null;
    status?: string;
    price?: number;
    components?: ComponentParam[];
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
    select: {
      id: true,
      componentReference: true,
    },
  });

  if (!bundleVariant) throw new Error("Bundle variant not found");

  const shopify = await connections.shopify.forShopId(shopId);
  if (!shopify) throw new Error("Shopify connection not established");

  let componentsChanged = false;

  if (components) {
    const existing = await api.bundleComponent.findMany({
      filter: {
        bundleVariantId: { equals: bundleVariant.id },
        shopId: { equals: shopId },
      },
      select: {
        id: true,
        productVariantId: true,
        quantity: true,
      },
    });

    const existingById = new Map(existing.map((component) => [component.id, component]));
    const suppliedIds = new Set(components.map((component) => component.id).filter(Boolean) as string[]);

    for (const component of components) {
      if (component.id && existingById.has(component.id)) {
        const current = existingById.get(component.id);

        if (
          current?.quantity !== component.quantity ||
          current?.productVariantId !== component.productVariantId
        ) {
          await api.internal.bundleComponent.update(component.id, {
            productVariant: { _link: component.productVariantId },
            quantity: component.quantity,
          });
          componentsChanged = true;
        }
      } else {
        await api.internal.bundleComponent.create({
          bundleVariant: { _link: bundleVariant.id },
          productVariant: { _link: component.productVariantId },
          quantity: component.quantity,
          shop: { _link: shopId },
        });
        componentsChanged = true;
      }
    }

    for (const existingComponent of existing) {
      if (!suppliedIds.has(existingComponent.id)) {
        await api.internal.bundleComponent.delete(existingComponent.id);
        componentsChanged = true;
      }
    }
  }

  const product: {
    title?: string;
    status?: string;
    descriptionHtml?: string;
  } = {};
  const productChanges: string[] = [];
  const variant: {
    price?: number;
    metafields?: {
      namespace: "bundle";
      key: "componentReference";
      value: string;
    }[];
  } = {};
  const variantChanges: string[] = [];

  if (title !== undefined) {
    product.title = title;
    productChanges.push("title");
  }
  if (status !== undefined) {
    product.status = status.toUpperCase();
    productChanges.push("status");
  }
  if (description !== undefined) {
    product.descriptionHtml = description ?? "";
    productChanges.push("descriptionHtml");
  }
  if (price !== undefined) {
    variant.price = price;
    variantChanges.push("price");
  }

  if (componentsChanged) {
    const variantGIDs = JSON.stringify(await fetchVariantGIDs(bundleVariant.id, shopId));
    if (variantGIDs !== JSON.stringify(bundleVariant.componentReference)) {
      variant.metafields = [
        {
          namespace: "bundle",
          key: "componentReference",
          value: variantGIDs,
        },
      ];
      variantChanges.push("metafields");
    }
  }

  if (productChanges.length) {
    const productUpdateHandle = await api.enqueue(shopify.graphql, {
      query: `mutation UpdateBundleProduct($input: ProductUpdateInput!) {
        productUpdate(product: $input) {
          userErrors {
            field
            message
          }
        }
      }`,
      variables: {
        input: {
          id: `gid://shopify/Product/${bundle.id}`,
          ...product,
        },
      },
    });

    const productUpdateResponse = (await productUpdateHandle.result()) as {
      productUpdate?: {
        userErrors?: { field?: string[]; message: string }[];
      };
    };

    if (productUpdateResponse?.productUpdate?.userErrors?.length) {
      throw new Error(productUpdateResponse.productUpdate.userErrors[0].message);
    }
  }

  if (variantChanges.length) {
    const productVariantUpdateHandle = await api.enqueue(shopify.graphql, {
      query: `mutation UpdateBundleVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          userErrors {
            message
          }
        }
      }`,
      variables: {
        productId: `gid://shopify/Product/${bundle.id}`,
        variants: [
          {
            id: `gid://shopify/ProductVariant/${bundleVariant.id}`,
            ...variant,
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

    await api.enqueue(
      api.updateBundleComponentQuantity,
      {
        bundleVariantId: bundleVariant.id,
        shopId,
      },
      {
        queue: {
          name: `updateBundleComponentQuantity-${shopId}`,
          maxConcurrency: 1,
        },
        retries: 1,
      }
    );
  }

  return {
    bundleId: bundle.id,
  };
};

export const params = {
  bundleId: { type: "string" },
  title: { type: "string" },
  description: { type: "string" },
  status: { type: "string" },
  price: { type: "number" },
  components: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        productVariantId: { type: "string" },
        quantity: { type: "number" },
      },
    },
  },
};
