import { applyParams, save, ActionOptions, CreateShopperSuggestionActionContext } from "gadget-server";

/**
 * @param { CreateShopperSuggestionActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreateShopperSuggestionActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
