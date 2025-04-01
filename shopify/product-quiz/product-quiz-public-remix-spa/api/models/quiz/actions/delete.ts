import { deleteRecord, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
};

export const onSuccess: ActionOnSuccess = async ({ record, api}) => {
  // Cleaning up quiz questions
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
  // Using public API to make sure that deletion is propogated all the way to recommendedProducts
  await api.question.bulkDelete(ids);
}

export const options: ActionOptions = {
  actionType: "delete",
};
