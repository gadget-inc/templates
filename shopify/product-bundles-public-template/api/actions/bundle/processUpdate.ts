import type { ActionOptions } from "gadget-server";
import { setBundleQuantitiesMetafield } from "../../lib/bundle/setBundleQuantitiesMetafield";

type ComponentParam = {
  id?: string;
  productVariantId: string;
  quantity: number;
};

type ProcessUpdateParams = {
  shopId?: string;
  bundleId?: string;
  components?: ComponentParam[];
};

type ProductVariantsBulkUpdateResponse = {
  productVariantsBulkUpdate?: {
    userErrors?: { message: string }[];
  };
};

export const options: ActionOptions = {
  timeoutMS: 30000,
};

export const run: ActionRun = async ({ params, api, connections }) => {
  const { shopId, bundleId, components } = params as ProcessUpdateParams;

  if (!shopId) throw new Error("Shop ID not provided");
  if (!bundleId) throw new Error("Bundle ID is required");
  if (!components) throw new Error("Components are required");

  const bundle = await api.shopifyProduct.findOne(bundleId, {
    select: {
      id: true,
      shopId: true,
    },
  });

  if (bundle.shopId !== shopId) {
    throw new Error("Bundle not found");
  }

  const bundleVariant = await api.shopifyProductVariant.findFirst({
    filter: {
      productId: { equals: bundle.id },
      shopId: { equals: shopId },
    },
    select: { id: true },
  });

  if (!bundleVariant) throw new Error("Bundle variant not found");

  const shopify = await connections.shopify.forShopId(shopId);
  if (!shopify) throw new Error("Shopify connection not established");

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
  const suppliedIds = new Set(
    components.map((component) => component.id).filter((id): id is string => Boolean(id))
  );

  const mutations: Promise<unknown>[] = [];

  for (const component of components) {
    const current = component.id ? existingById.get(component.id) : undefined;

    if (component.id && current) {
      if (
        current.quantity !== component.quantity ||
        current.productVariantId !== component.productVariantId
      ) {
        mutations.push(
          api.internal.bundleComponent.update(component.id, {
            productVariant: { _link: component.productVariantId },
            quantity: component.quantity,
          })
        );
      }
    } else {
      mutations.push(
        api.internal.bundleComponent.create({
          bundleVariant: { _link: bundleVariant.id },
          productVariant: { _link: component.productVariantId },
          quantity: component.quantity,
          shop: { _link: shopId },
        })
      );
    }
  }

  for (const existingComponent of existing) {
    if (!suppliedIds.has(existingComponent.id)) {
      mutations.push(api.internal.bundleComponent.delete(existingComponent.id));
    }
  }

  await Promise.all(mutations);

  const variantGIDs = components.map(
    (component) => `gid://shopify/ProductVariant/${component.productVariantId}`
  );

  const productVariantUpdateResponse = await shopify.graphql<ProductVariantsBulkUpdateResponse>(
    `mutation UpdateBundleVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors {
          message
        }
      }
    }`,
    {
      productId: `gid://shopify/Product/${bundle.id}`,
      variants: [
        {
          id: `gid://shopify/ProductVariant/${bundleVariant.id}`,
          metafields: [
            {
              namespace: "bundle",
              key: "componentReference",
              value: JSON.stringify(variantGIDs),
            },
          ],
        },
      ],
    }
  );

  if (productVariantUpdateResponse?.productVariantsBulkUpdate?.userErrors?.length) {
    throw new Error(productVariantUpdateResponse.productVariantsBulkUpdate.userErrors[0].message);
  }

  await setBundleQuantitiesMetafield({
    api,
    connections,
    bundleVariantId: bundleVariant.id,
    shopId,
  });

  return {
    bundleId: bundle.id,
  };
};

export const params = {
  shopId: { type: "string" },
  bundleId: { type: "string" },
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
