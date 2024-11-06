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
  const shop = await api.shopifyShop.findOne(record.shopId as string, {
    select: {
      name: true,
      currency: true,
      activeSubscriptionId: true,
      usagePlanId: true,
      overage: true,
      plan: {
        pricePerOrder: true,
      },
    },
  });

  await api.enqueue(
    api.chargeShop,
    {
      shop: {
        id: record.shopId,
        currency: shop.currency,
        activeSubscriptionId: shop.activeSubscriptionId,
        usagePlanId: shop.usagePlanId,
        overage: shop.overage,
        plan: {
          price: shop.plan?.pricePerOrder ?? 0,
        },
      },
      order: {
        email: record.email,
      },
    },
    {
      queue: {
        name: shop.name as string,
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
