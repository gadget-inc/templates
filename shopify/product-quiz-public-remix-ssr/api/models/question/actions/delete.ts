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
  // Find the related answers
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

  // Map to get the ids of the answers
  const ids = answers.map((answer) => answer.id);

  // Using public API to make sure that deletion is propogated all the way to recommendedProducts
  await api.answer.bulkDelete(ids);
};

export const options: ActionOptions = {
  actionType: "delete",
};
