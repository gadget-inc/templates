import { applyParams, save, ActionOptions, logger } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { isFullPage } from "@notionhq/client";
import { JSONValue } from "@gadget-client/finance-dashboard-app";
import { api } from "gadget-server";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const getNotionOrder = async (orderId: string) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DB_ID ?? "",
    filter: {
      property: "Order ID",
      rich_text: {
        equals: orderId,
      },
    },
  });

  return response;
};

const updateOrderInNotion = async (
  orderId: string,
  totalPrice: string | null,
  jsonValCOGS: JSONValue | null,
  jsonValMargin: JSONValue | null,
  notionOrder: QueryDatabaseResponse
) => {
  const price = Number(totalPrice);
  const costOfGoods = Number(jsonValCOGS);
  const margin = Number(jsonValMargin);
  const updates: { id: string; pageId: string; value: number }[] = [];

  for (const result of notionOrder.results) {
    if (!isFullPage(result)) continue;

    const typeProp = result.properties.Type;
    const valueProp = result.properties.Value;
    if (typeProp.type !== "select" || valueProp.type !== "number") continue;

    let newValue: number | undefined;
    if (typeProp.select?.name === "Sales") newValue = price;
    if (typeProp.select?.name === "Cost of Goods") newValue = costOfGoods;
    if (typeProp.select?.name === "Margin") newValue = margin;

    if (newValue !== undefined && valueProp.number !== newValue)
      updates.push({ id: orderId, pageId: result.id, value: newValue });
  }

  logger.info("*** updates ***");
  logger.info(JSON.stringify(updates));

  if (updates.length > 0)
    return await api.enqueue(api.shopifyOrder.bulkUpdateNotionOrder, updates, {
      queue: { name: "notion-jobs" },
    });
};

export const enqueueNotionJob = async (
  orderId: string,
  totalPrice: string | null,
  jsonValCOGS: JSONValue | null,
  jsonValMargin: JSONValue | null
) => {
  // We only write new records to Notion if the order ID is not in the DB yet
  const price = Number(totalPrice);
  const costOfGoods = Number(jsonValCOGS);
  const margin = Number(jsonValMargin);

  if (price && costOfGoods && margin) {
    // Sales, COGS and margin are three separate rows because of Notion's graphing limitations
    // See https://youtu.be/i_D8MlBAk0A?feature=shared&t=2068
    const notionPages = [
      { id: orderId, rowType: "Sales", value: price },
      { id: orderId, rowType: "Cost of Goods", value: costOfGoods },
      { id: orderId, rowType: "Margin", value: margin },
    ];

    await api.enqueue(api.shopifyOrder.bulkCreateNotionOrder, notionPages, {
      queue: { name: "notion-jobs" },
    });
  } else {
    logger.error(
      `Invalid data for order ${orderId}: price=${price}, costOfGoods=${costOfGoods}, margin=${margin}`
    );
  }
};

export const run: ActionRun = async ({ params, record }) => {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
};

export const onSuccess: ActionOnSuccess = async ({ params, record, api }) => {
  const {
    id: orderId,
    totalPrice,
    costOfGoods: jsonValCOGS,
    margin: jsonValMargin,
  } = await api.shopifyOrder.findOne(record.id, {
    select: { id: true, totalPrice: true, costOfGoods: true, margin: true },
  });

  const notionOrder = await getNotionOrder(orderId);

  if (notionOrder.results.length > 0) {
    logger.info("*** updating order...");
    updateOrderInNotion(
      orderId,
      totalPrice,
      jsonValCOGS,
      jsonValMargin,
      notionOrder
    );
  } else {
    logger.info("*** creating new order...");
    await enqueueNotionJob(orderId, totalPrice, jsonValCOGS, jsonValMargin);
  }
};

export const options: ActionOptions = { actionType: "update" };
