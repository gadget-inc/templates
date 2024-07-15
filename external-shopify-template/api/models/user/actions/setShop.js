import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  SetShopUserActionContext,
} from "gadget-server";
import { default as jwt } from "jsonwebtoken";

/**
 * @param { SetShopUserActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  logger.info({ params }, "Params");

  const { token } = params;

  const { shopId } = jwt.verify(token, process.env.JWT_SECRET);

  logger.info({ shopId }, "Shop ID");

  if (record.shopId !== shopId) {
    record.shop = { _link: shopId };
  }

  await save(record);
}

/**
 * @param { SetShopUserActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};

export const params = {
  token: {
    type: "string",
  },
};
