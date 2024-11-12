export const run: ActionRun = async ({ params, logger, api, connections }) => {
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
      allLineItems.push(...lineItems);
    }

    const seen: { [key: string]: boolean } = {};
    const products: {
      id: string;
      title: string;
      image: string;
      alt: string;
    }[] = [];

    for (const { product } of allLineItems) {
      if (!product?.id) continue;

      if (!seen[product?.id]) {
        seen[product?.id] = true;
        products.push({
          id: product?.id,
          title: product.title ?? "",
          image: product.featuredMedia?.file?.url ?? "",
          alt: product.featuredMedia?.file?.alt ?? "",
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
};

export const params = {
  code: {
    type: "string",
  },
};
