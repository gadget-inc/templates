import { applyParams, save, ActionOptions } from "gadget-server";
import { preventCrossShopDataAccess } from "gadget-server/shopify";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const updateNotionDb = async (
  orderId: string,
  type: "Sales" | "Cost of Goods" | "Margin",
  value: number
) => {
  return await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: process.env.NOTION_DB_ID ?? "",
    },
    properties: {
      "Order ID": {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: orderId,
            },
          },
        ],
      },
      Type: {
        type: "select",
        select: {
          name: type,
        },
      },
      Value: {
        type: "number",
        number: value,
      },
      "Created At": {
        type: "date",
        date: {
          start: new Date(Date.now()).toISOString(),
        },
      },
    },
  });
};

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
  // Write new order to Notion
  try {
    logger.debug(`Calculating sales and COGS for order ${record.id}`);

    const lineItems = await api.shopifyOrderLineItem.findMany({
      filter: { orderId: { equals: record.id } },
      select: {
        id: true,
        price: true,
        quantity: true,
        name: true,
        variant: {
          id: true,
          title: true,
          inventoryItem: {
            id: true,
            cost: true,
          },
        },
      },
    });

    logger.debug(`Found ${lineItems.length} line items for order ${record.id}`);

    let totalSales = 0;
    let totalCOGS = 0;
    let itemsWithoutInventory = 0;

    for (const lineItem of lineItems) {
      try {
        const itemPrice = parseFloat(lineItem.price || "0");
        const itemQuantity = lineItem.quantity || 0;
        const itemSales = itemPrice * itemQuantity;
        totalSales += itemSales;

        if (lineItem.variant?.inventoryItem?.cost) {
          const itemCost = parseFloat(lineItem.variant.inventoryItem.cost);
          const itemCOGS = itemCost * itemQuantity;
          totalCOGS += itemCOGS;
        } else if (lineItem.variant) {
          logger.debug(`Can't find inventory item for ${lineItem.variant}`);
        } else {
          logger.debug("Can't find variant");
        }
        logger.info(
          `Order ${record.id} totals - Sales: $${totalSales} COGS: $${totalCOGS}`
        );

        if (totalCOGS > 0) {
          logger.info(await updateNotionDb(record.id, "Sales", totalSales));
          logger.info(
            await updateNotionDb(record.id, "Cost of Goods", totalCOGS)
          );
          logger.info(
            await updateNotionDb(record.id, "Margin", totalSales - totalCOGS)
          );
        }
      } catch (error) {
        logger.error(error);
      }
    }
  } catch (error) {
    logger.error(error);
  }
};

export const options: ActionOptions = { actionType: "create" };
