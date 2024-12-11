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
  // clean up quiz answers
  const answers = await api.answer.findMany({
    filter: {
      questionId: {
        equals: record.id,
      },
    },
    select: {
      id: true,
    },
  });

  const ids = answers.map((answer) => answer.id);
  await api.answer.bulkDelete(ids);
};

export const options: ActionOptions = {
  actionType: "delete",
  triggers: { api: true },
};
