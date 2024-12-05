import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
} from "gadget-server";
import { processShopifyThemeVersion } from "../utils";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
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
  await processShopifyThemeVersion(record, api);
};

export const options: ActionOptions = {
  actionType: "create",
  triggers: { api: false },
};
