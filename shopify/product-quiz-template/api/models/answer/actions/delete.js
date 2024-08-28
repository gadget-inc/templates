import {
  deleteRecord,
  ActionOptions,
  DeleteAnswerActionContext,
} from "gadget-server";

/**
 * @param { DeleteAnswerActionContext } context
 */
export async function run({ params, record, logger, api }) {
  await deleteRecord(record);
}

/**
 * @param { DeleteAnswerActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // clean up recommended product
  const recommendation = await api.recommendedProduct.findFirst({
    filter: {
      answer: {
        equals: record.id,
      },
    },
    select: {
      id: true,
    },
  });

  await api.recommendedProduct.delete(recommendation.id);
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
  triggers: { api: true },
};
