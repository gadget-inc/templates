export const run: ActionRun = async ({ params, api, connections }) => {
  const shopId = String(connections.shopify.currentShopId ?? "");
  if (!shopId) throw new Error("Shop ID not provided");

  const bundleId = (params as { bundleId?: string }).bundleId;
  if (!bundleId) throw new Error("Bundle ID is required");

  const handle = await api.enqueue(api.bundle.processUpdate, { ...params, shopId }, {
    shopifyShop: shopId,
  });

  return {
    bundleId,
    backgroundActionId: handle.id,
  };
};

export const params = {
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
