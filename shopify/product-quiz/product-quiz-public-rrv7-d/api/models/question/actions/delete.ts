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
  // Cleaning up answer records
  const answers = await api.answer.findMany({
    filter: {
      questionId: {
        equals: record.id,
      },
    },
    first: 250,
    select: {
      id: true,
    },
  });

  const ids = answers.map((answer) => answer.id);
  // Using public API to make sure that deletion is propogated all the way to recommendedProducts
  await api.answer.bulkDelete(ids);
};

export const options: ActionOptions = {
  actionType: "delete",
};
