import { applyParams, save, ActionOptions } from "gadget-server";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  applyParams(params, record);
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

    await api.enqueue(api.metadata.reviews.metafield.update, {
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
