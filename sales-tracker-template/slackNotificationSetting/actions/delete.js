import { deleteRecord, ActionOptions, DeleteSlackNotificationSettingActionContext } from "gadget-server";

/**
 * @param { DeleteSlackNotificationSettingActionContext } context
 */
export async function run({ params, record, logger, api }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteSlackNotificationSettingActionContext } context
 */
export async function onSuccess({ params, record, logger, api }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete"
};
