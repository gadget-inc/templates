import { applyParams, save, ActionOptions, CreateBundleActionContext } from "gadget-server";

/**
 * @param { CreateBundleActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);

  record.titleLowercase = title.toLowerCase()

  await save(record);
};

/**
 * @param { CreateBundleActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
