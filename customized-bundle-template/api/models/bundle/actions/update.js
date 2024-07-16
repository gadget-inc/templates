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
    record.titleLowercase = record.title.toLowerCase();
  }

  await save(record);
}

/**
 * @param { UpdateBundleActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
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

  const variantGIDs = JSON.stringify(
    await fetchVariantGIDs(record.id, record.shopId)
  );

  if (variantGIDs !== JSON.stringify(bundleVariant.componentReference)) {
    variant.metafields = [
      {
        id: record.componentReferenceMetafieldId,
        value: variantGIDs,
      },
    ];
    variantChanges.push("metafields");
  }

  // Might need to change the logic to use the new productBundleUpdate mutation from 24-07
  await api.enqueue(
    api.updateBundleInShopify,
    {
      shopId: record.shopId,
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
        name: `updateBundleInShopify-${record.shopId}`,
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
