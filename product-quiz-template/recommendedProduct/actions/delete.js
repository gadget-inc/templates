import { deleteRecord, ActionOptions, DeleteRecommendedProductActionContext } from "gadget-server";

/**
 * @param { DeleteRecommendedProductActionContext } context
 */
export async function run({ params, record, logger, api }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteRecommendedProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete"
};
