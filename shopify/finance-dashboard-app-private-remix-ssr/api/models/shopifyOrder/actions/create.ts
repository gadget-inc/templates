import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";

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
  record,
  logger,
  api,
}) => {
  const { id: orderId, totalPrice, costOfGoods: jsonValCOGS, margin: jsonValMargin } = await api.shopifyOrder.findOne(record.id, {
    select: { id: true, totalPrice: true, costOfGoods: true, margin: true }
  });

  const price = Number(totalPrice);
  const costOfGoods = Number(jsonValCOGS);
  const margin = Number(jsonValMargin);

  if (price && costOfGoods && margin) {
    // Sales, COGS and margin are three separate rows because of Notion's graphing limitations
    // See https://youtu.be/i_D8MlBAk0A?feature=shared&t=2068
    const notionPages = [
      { id: orderId, rowType: "Sales", value: price },
      { id: orderId, rowType: "Cost of Goods", value: costOfGoods },
      { id: orderId, rowType: "Margin", value: margin }
    ];

    await api.enqueue(api.shopifyOrder.bulkUpdateNotion, notionPages);
  } else {
    logger.error(`Invalid data for order ${orderId}: price=${price}, costOfGoods=${costOfGoods}, margin=${margin}`);
  }
};

export const options: ActionOptions = { actionType: "create" };
