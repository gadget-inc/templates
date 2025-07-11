import { deleteRecord, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async ({ record, api }) => {
  // Delete related recommended products
  await api.internal.recommendedProduct.deleteMany({
    filter: {
      answerId: {
        equals: record.id,
      },
    },
  });
};

export const options: ActionOptions = {
  actionType: "delete",
};
