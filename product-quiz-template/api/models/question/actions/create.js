import {
  applyParams,
  save,
  ActionOptions,
  CreateQuestionActionContext,
} from "gadget-server";

/**
 * @param { CreateQuestionActionContext } context
 */
export async function run({ params, record, connections, logger, api }) {
  applyParams(params, record);

  record.shop = { _link: connections.shopify.currentShopId };

  await save(record);
}

/**
 * @param { CreateQuestionActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {}

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
  triggers: { api: true },
};
