import { applyParams, save, ActionOptions, CreateSlackNotificationSettingActionContext } from "gadget-server";

/**
 * @param { CreateSlackNotificationSettingActionContext } context
 */
export async function run({ params, record, logger, api }) {
  applyParams(params, record);
  await save(record);
};

/**
 * @param { CreateSlackNotificationSettingActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
