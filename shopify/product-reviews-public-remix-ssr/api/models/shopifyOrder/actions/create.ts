import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { default as code } from "short-uuid";
import { setReviewCreationLimit } from "../utils";

export const run: ActionRun = async ({
  params,
  record,
  logger,
  api,
  connections,
  trigger,
}) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  // Generate a single-use code for the review
  record.singleUseCode = code.generate();

  setReviewCreationLimit({ record, trigger });

  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {};

export const options: ActionOptions = { actionType: "create" };
