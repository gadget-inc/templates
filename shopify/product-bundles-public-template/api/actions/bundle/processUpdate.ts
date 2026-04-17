import type { ActionOptions } from "gadget-server";
import { fetchVariantGIDs } from "../../lib/bundle/fetchVariantGIDs";
import { syncBundleComponentQuantities } from "../../lib/bundle/syncBundleComponentQuantities";

type ComponentParam = {
  id?: string;
  productVariantId: string;
  quantity: number;
};

export const options: ActionOptions = {
  timeoutMS: 30000,
};

export const run: ActionRun = async ({ params, api, connections }) => {
  const shopId = String((params as { shopId?: string }).shopId ?? "");
  if (!shopId) throw new Error("Shop ID not provided");

  const { bundleId, components } = params as {
    bundleId?: string;
    components?: ComponentParam[];
  };

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

  let componentsChanged = false;

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

  if (!componentsChanged) {
    return { bundleId: bundle.id };
  }

  const variantGIDs = JSON.stringify(await fetchVariantGIDs(bundleVariant.id, shopId));
  if (variantGIDs !== JSON.stringify(bundleVariant.componentReference)) {
    const productVariantUpdateResponse = (await shopify.graphql(
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
                value: variantGIDs,
              },
            ],
          },
        ],
      }
    )) as {
      productVariantsBulkUpdate?: {
        userErrors?: { message: string }[];
      };
    };

    if (productVariantUpdateResponse?.productVariantsBulkUpdate?.userErrors?.length) {
      throw new Error(productVariantUpdateResponse.productVariantsBulkUpdate.userErrors[0].message);
    }
  }

  await syncBundleComponentQuantities({
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
