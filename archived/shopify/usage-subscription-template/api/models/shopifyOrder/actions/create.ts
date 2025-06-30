import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
} from "gadget-server";

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
  if (!record.shopId) throw new Error("shopId is required");

  const shop = await api.shopifyShop.findOne(record.shopId, {
    select: {
      name: true,
      activeSubscriptionId: true,
      usagePlanId: true,
      overage: true,
      plan: {
        pricePerOrder: true,
        currency: true,
      },
    },
  });

  if (!shop.name) throw new Error("shop name is required");

  await api.enqueue(
    api.chargeShop,
    {
      shop: {
        id: record.shopId,
        activeSubscriptionId: shop.activeSubscriptionId,
        usagePlanId: shop.usagePlanId,
        overage: shop.overage,
        plan: {
          price: shop.plan?.pricePerOrder ?? 0,
          currency: shop.plan?.currency ?? "CAD",
        },
      },
      order: {
        email: record.email,
      },
    },
    {
      queue: {
        name: shop.name,
        maxConcurrency: 4,
      },
      retries: 1,
    }
  );
};

export const options: ActionOptions = {
  actionType: "create",
  triggers: { api: false },
};
