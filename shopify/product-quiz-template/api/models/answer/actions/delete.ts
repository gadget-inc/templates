import {
  deleteRecord,
  ActionOptions,
  preventCrossShopDataAccess,
} from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api }) => {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
}) => {
  // clean up recommended product
  const recommendation = await api.recommendedProduct.findFirst({
    filter: {
      answerId: {
        equals: record.id,
      },
    },
    select: {
      id: true,
    },
  });

  await api.recommendedProduct.delete(recommendation.id);
};

export const options: ActionOptions = {
  actionType: "delete",
  triggers: { api: true },
};
