import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
} from "gadget-server";
import { applyTags } from "../utils";

export const run: ActionRun = async ({ params, record, logger, api }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  if (record.changed("body")) {
    await applyTags({
      id: record.id,
      body: record.body,
      tags: record.tags as string[],
    });
  }
};

export const options: ActionOptions = {
  actionType: "update",
  triggers: { api: false },
};
