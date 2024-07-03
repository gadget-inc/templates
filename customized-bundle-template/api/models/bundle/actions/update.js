import {
  applyParams,
  save,
  ActionOptions,
  UpdateBundleActionContext,
} from "gadget-server";
import { fetchVariantGIDs } from "../../../../utilities";

/**
 * @param { UpdateBundleActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);

  if (record.changed("title")) {
    record.titleLowercase = title.toLowerCase();
  }

  await save(record);
}

/**
 * @param { UpdateBundleActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const shopId = connections.shopify.currentShopId.toString();

  const bundleVariant = await api.shopifyProductVariant.findOne(
    record.bundleVariantId,
    {
      select: {
        productId: true,
        componentReference: true,
      },
    }
  );

  const product = { id: bundleVariant.productId },
    productChanges = [],
    variant = { id: record.bundleVariantId },
    variantChanges = [];

  for (const change of Object.entries(record.changes())) {
    const [key, value] = change;
    switch (key) {
      case "title":
        product.title = value.current;
        productChanges.push("title");
        break;
      case "status":
        product.status = value.current;
        productChanges.push("status");
        break;
      case "price":
        variant.price = value.current;
        variantChanges.push("price");
        break;
      case "requiresComponents":
        variant.requiresComponents = value.current;
        variantChanges.push("requiresComponents");
        break;
      case "description":
        variant.description = value.current;
        variantChanges.push("description");
        break;
      default:
        break;
    }
  }

  const variantGIDs = JSON.stringify(await fetchVariantGIDs(record.id, shopId));

  if (variantGIDs !== JSON.stringify(bundleVariant.componentReference)) {
    variant.metafields = [
      {
        namespace: "bundle",
        key: "componentReference",
        type: "list.variant_reference",
        value: variantGIDs,
      },
    ];
    variantChanges.push("metafields");
  }

  await api.enqueue(
    api.updateBundleInShopify,
    {
      shopId,
      bundle: {
        id: record.id,
        product,
        variant,
      },
      productChanges,
      variantChanges,
    },
    {
      queue: {
        name: `updateBundleInShopify-${shopId}`,
        maxConcurrency: 2,
      },
      retries: 1,
    }
  );
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
