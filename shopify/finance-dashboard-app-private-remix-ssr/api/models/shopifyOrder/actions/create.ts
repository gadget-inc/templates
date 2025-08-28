import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { enqueueNotionJob } from "../utils";

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ record, logger, api }) => {
  const {
    id: orderId,
    totalPrice,
    costOfGoods: jsonValCOGS,
    margin: jsonValMargin,
  } = await api.shopifyOrder.findOne(record.id, {
    select: { id: true, totalPrice: true, costOfGoods: true, margin: true },
  });

  await enqueueNotionJob(orderId, totalPrice, jsonValCOGS, jsonValMargin);
};

export const options: ActionOptions = { actionType: "create" };
