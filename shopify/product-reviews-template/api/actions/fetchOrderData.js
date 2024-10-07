import { FetchOrderDataGlobalActionContext } from "gadget-server";

/**
 * @param { FetchOrderDataGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  logger.info({ params }, "params");

  const order = await api.shopifyOrder.maybeFindFirst({
    filter: {
      singleUseCode: {
        equals: params.code,
      },
    },
    select: {
      id: true,
      orderNumber: true,
    },
  });

  if (order) {
    logger.info({ order }, "order");

    let lineItems = await api.shopifyOrderLineItem.findMany({
      filter: {
        order: {
          equals: order.id,
        },
      },
      select: {
        id: true,
        product: {
          id: true,
          title: true,
          images: {
            edges: {
              node: {
                source: true,
              },
            },
          },
        },
      },
    });

    let allLineItems = lineItems;

    while (lineItems.hasNextPage) {
      lineItems = await lineItems.nextPage();
      allLineItems = allLineItems.concat(lineItems);
    }

    const seen = {};
    const products = [];

    for (const {
      product: { id, title, images },
    } of allLineItems) {
      if (!seen[id]) {
        seen[id] = true;
        products.push({
          id: id,
          title: title,
          image: images.edges[0].node.source,
        });
      }
    }

    await api.internal.shopifyOrder.update(order.id, {
      singleUseCode: null,
    });

    return { orderId: order.id, orderNumber: order.orderNumber, products };
  } else {
    throw new Error(`Single use code not found: ${params.code}`);
  }
}

export const params = {
  code: {
    type: "string",
  },
};
