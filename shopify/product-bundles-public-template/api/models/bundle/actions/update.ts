import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { fetchVariantGIDs } from "../../../utils";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  if (!record.bundleVariantId) throw new Error("Bundle variant ID not found");

  // Find the bundle's parent product variant
  const bundleVariant = await api.shopifyProductVariant.findOne(
    record.bundleVariantId,
    {
      select: {
        productId: true,
        componentReference: true,
      },
    }
  );

  // Create some arrays and objects to store the changes
  const product: {
    id: string | null;
    title?: string;
    status?: string;
    descriptionHtml?: string;
  } = { id: bundleVariant.productId },
    productChanges: string[] = [],
    variant: {
      id: string | null;
      price?: number;
      metafields?: {
        namespace: "bundle";
        key: "componentReference";
        value: string;
      }[];
    } = {
      id: record.bundleVariantId,
    },
    variantChanges: string[] = [];

  // Loop through the changes and update the product and variant objects
  for (const change of Object.entries(record.changes())) {
    const [key, value] = change;
    switch (key) {
      case "title":
        product.title = value.current;
        productChanges.push("title");
        break;
      case "status":
        product.status = value.current.toUpperCase();
        productChanges.push("status");
        break;
      case "description":
        product.descriptionHtml = value.current;
        productChanges.push("descriptionHtml");
        break;
      case "price":
        variant.price = value.current;
        variantChanges.push("price");
        break;
      default:
        break;
    }
  }

  // Create a stringified version of the component variants' GIDs
  const variantGIDs = JSON.stringify(
    await fetchVariantGIDs(record.id, String(connections.shopify.currentShop?.id))
  );

  // Compare the stringified GIDs to the metafield value. If they differ, add metafields to the list of changes
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

  const shopId = String(connections.shopify.currentShop?.id ?? record.shopId ?? "");

  if (!shopId) throw new Error("Shop ID not provided");

  const shopify = await connections.shopify.forShopId(shopId);

  if (!shopify) throw new Error("Shopify connection not established");

  if (productChanges.length) {
    if (!bundleVariant.productId) throw new Error("Bundle product ID not found");

    const { id: productId, ...productData } = product;

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
          id: `gid://shopify/Product/${productId}`,
          ...productData,
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
    if (!variant.id) throw new Error("Bundle variant ID not found");
    if (!bundleVariant.productId) throw new Error("Bundle product ID not found");

    const { id: variantId, ...variantData } = variant;

    const productVariantUpdateHandle = await api.enqueue(shopify.graphql, {
      query: `mutation UpdateBundleVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          userErrors {
            message
          }
        }
      }`,
      variables: {
        productId: `gid://shopify/Product/${bundleVariant.productId}`,
        variants: [
          {
            id: `gid://shopify/ProductVariant/${variantId}`,
            ...variantData,
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
        bundleVariantId: variantId,
        bundleId: record.id,
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
};

export const options: ActionOptions = {
  actionType: "update",
};
