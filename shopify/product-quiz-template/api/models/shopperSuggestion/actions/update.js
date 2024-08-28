import { applyParams, save, UpdateShopperSuggestionActionContext } from "gadget-server";

/**
 * @param { UpdateShopperSuggestionActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { UpdateShopperSuggestionActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: true },
};