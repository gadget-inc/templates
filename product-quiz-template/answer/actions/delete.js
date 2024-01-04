import { deleteRecord, ActionOptions, DeleteAnswerActionContext } from "gadget-server";

/**
 * @param { DeleteAnswerActionContext } context
 */
export async function run({ params, record, logger, api }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteAnswerActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // clean up recommended products
  const recommendations = await api.recommendedProduct.findMany({
    filter: {
      answer: {
        equals: record.id
      }
    },
    select: {
      id: true
    }
  });

  const id = recommendations[0].id;
  await api.recommendedProduct.delete(id);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete"
};
