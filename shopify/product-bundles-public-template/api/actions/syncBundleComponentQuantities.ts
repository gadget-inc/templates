import { syncBundleComponentQuantities as syncBundleComponentQuantitiesHelper } from "./bundle/helpers";

export const run: ActionRun = async ({ params, api, connections }) => {
  const { id, quantity, productVariantId, bundleVariantId, shopId } = params;

  if (!shopId) throw new Error("Shop ID is required");
  if (!bundleVariantId) throw new Error("Bundle variant ID is required");

  await syncBundleComponentQuantitiesHelper({
    api,
    connections,
    id,
    quantity,
    productVariantId,
    bundleVariantId,
    shopId,
  });
};

export const params = {
  id: { type: "string" },
  quantity: { type: "number" },
  productVariantId: { type: "string" },
  bundleVariantId: { type: "string" },
  shopId: { type: "string" },
};
