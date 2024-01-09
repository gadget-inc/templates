import { deleteRecord, ActionOptions, DeleteShopperSuggestionActionContext } from "gadget-server";

/**
 * @param { DeleteShopperSuggestionActionContext } context
 */
export async function run({ params, record, logger, api }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteShopperSuggestionActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {

};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete"
};
