import { deleteRecord, ActionOptions, DeleteQuestionActionContext } from "gadget-server";

/**
 * @param { DeleteQuestionActionContext } context
 */
export async function run({ params, record, logger, api }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteQuestionActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // clean up quiz answers
  const answers = await api.answer.findMany({
    filter: {
      question: {
        equals: record.id
      }
    },
    select: {
      id: true
    }
  });

  const ids = answers.map(answer => answer.id);
  await api.answer.bulkDelete(ids);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
  triggers: { api: true },
};
