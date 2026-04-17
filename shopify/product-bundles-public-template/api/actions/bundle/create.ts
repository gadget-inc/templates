export const run: ActionRun = async ({ params, api, connections }) => {
  const shopId = String(connections.shopify.currentShopId ?? "");
  if (!shopId) throw new Error("Shop ID not provided");

  const handle = await api.enqueue(api.bundle.processCreate, { ...params, shopId }, {
    shopifyShop: shopId,
  });

  return {
    backgroundActionId: handle.id,
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
