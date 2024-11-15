import {
  deleteRecord,
  ActionOptions,
  DeleteQuizActionContext,
} from "gadget-server";

/**
 * @param { DeleteQuizActionContext } context
 */
export async function run({ params, record, logger, api }) {
  await deleteRecord(record);
}

/**
 * @param { DeleteQuizActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
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
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
  triggers: { api: true },
};
