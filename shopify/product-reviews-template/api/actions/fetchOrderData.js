import { FetchOrderDataGlobalActionContext } from "gadget-server";

/**
 * @param { FetchOrderDataGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
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
    let lineItems = await api.shopifyOrderLineItem.findMany({
      filter: {
        orderId: {
          equals: order.id,
        },
      },
      select: {
        id: true,
        product: {
          id: true,
          title: true,
          featuredMedia: {
            file: {
              url: true,
              alt: true,
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
      product: {
        id,
        title,
        featuredMedia: {
          file: { alt, url },
        },
      },
    } of allLineItems) {
      if (!seen[id]) {
        seen[id] = true;
        products.push({
          id: id,
          title: title,
          image: url,
          alt,
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
