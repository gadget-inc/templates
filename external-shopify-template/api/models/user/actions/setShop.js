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

  // Destructure the params object to get the token
  const { token } = params;

  // Verify the token and get the shopId
  const { shopId } = jwt.verify(token, process.env.JWT_SECRET);

  /**
   * If the shopId is different from the user's shopId, update the user's shopId
   * This would typically only be from null to a valid shopId
   */
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
