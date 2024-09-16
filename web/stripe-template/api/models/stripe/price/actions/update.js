import { applyParams, save, ActionOptions, UpdatePriceActionContext } from "gadget-server";

/**
 * @param { UpdatePriceActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { UpdatePriceActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
