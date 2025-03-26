import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { applyTags } from "../utils";

export const run: ActionRun = async ({ params, record, logger, api, connections }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ params, record, logger, api, connections }) => {
  if (record.changed("body")) {
    await applyTags({
      id: record.id,
      body: record.body,
      tags: record.tags as string[],
    });
  }
};

export const options: ActionOptions = { actionType: "update" };
