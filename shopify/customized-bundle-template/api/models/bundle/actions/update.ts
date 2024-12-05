import { applyParams, save, ActionOptions } from "gadget-server";
import { fetchVariantGIDs } from "../../../../utilities";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);

  // If the title changed, update the lowercase version to match
  if (record.changed("title")) {
    record.titleLowercase = record.title.toLowerCase();
  }

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
    await fetchVariantGIDs(record.id, record.shopId)
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

  // Enqueue the global action that updates the bundle in Shopify
  await api.enqueue(
    api.updateBundleInShopify,
    {
      shopId: record.shopId,
      bundle: {
        id: record.id,
        bundleVariantId: record.bundleVariantId,
        product,
        variant,
      },
      productChanges,
      variantChanges,
    },
    {
      queue: {
        name: `updateBundleInShopify-${record.shopId}`,
        maxConcurrency: 2,
      },
      retries: 1,
    }
  );
};

export const options: ActionOptions = {
  actionType: "update",
};
