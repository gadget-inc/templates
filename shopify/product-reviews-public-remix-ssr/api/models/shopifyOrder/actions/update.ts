import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { DateTime } from "luxon";
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

  if (
    record.changed("fulfillmentStatus") &&
    record.fulfillmentStatus === "fulfilled"
  ) {
    if (!record.shopId) throw new Error("shopId is required");

    const shop = await api.shopifyShop.findOne(record.shopId, {
      select: {
        daysUntilReviewRequest: true,
      },
    });

    if (!record.shopifyCreatedAt)
      throw new Error("shopifyCreatedAt is required");

    record.requestReviewAfter = DateTime.fromJSDate(
      new Date(record.shopifyCreatedAt)
    )
      .plus({ days: shop.daysUntilReviewRequest })
      .toJSDate();
  }

  if (record.reviewCreationLimit == null) {
    setReviewCreationLimit({ record, trigger });
  }

  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({
  params,
  record,
  logger,
  api,
  connections,
}) => {
  // Your logic goes here
};

export const options: ActionOptions = { actionType: "update" };
