import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

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
  const changes = record.changes("approved");

  if (changes.changed) {
    const approved = changes.current as boolean;

    await api.enqueue(api.metadata.review.metafield.update, {
      shopId: record.shopId,
      productId: record.productId,
      metaobjectId: record.metaobjectId,
      approved,
    });
  }
};

export const options: ActionOptions = {
  actionType: "update",
};
