import { applyParams, save, ActionOptions, CreateRecommendedProductActionContext } from "gadget-server";

/**
 * @param { CreateRecommendedProductActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreateRecommendedProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  triggers: { api: true },
};
