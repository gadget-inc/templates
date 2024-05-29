import { applyParams, save, ActionOptions, UpdateBundleActionContext } from "gadget-server";

/**
 * @param { UpdateBundleActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);

  if (record.changed("title")) {
    record.titleLowercase = title.toLowerCase()
  }

  await save(record);
};

/**
 * @param { UpdateBundleActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update"
};
