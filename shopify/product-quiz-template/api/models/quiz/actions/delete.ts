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
  // clean up quiz questions
  // on an update, remove old questions and answers and refresh quiz with new options
  const quizQuestions = await api.question.findMany({
    filter: {
      quizId: {
        equals: record.id,
      },
    },
    select: {
      id: true,
    },
  });

  const ids = quizQuestions.map((question) => question.id);
  await api.question.bulkDelete(ids);
};

export const options: ActionOptions = {
  actionType: "delete",
  triggers: { api: true },
};
