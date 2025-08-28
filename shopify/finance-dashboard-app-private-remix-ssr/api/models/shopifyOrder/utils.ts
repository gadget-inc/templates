import { JSONValue } from "@gadget-client/finance-dashboard-app";
import { api, logger } from "gadget-server";
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
