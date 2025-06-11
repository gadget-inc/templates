export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const { code } = params;

  if (!code) throw new Error("Single use code is required");

  // Find the order associated with the single use code
  const order = await api.shopifyOrder.maybeFindBySingleUseCode(code, {
    select: {
      id: true,
      reviewCreationLimit: true,
    },
  });

  // If no order is found, throw an error
  if (!order)
    throw new Error(`Order attributed with code '${params.code}' not found`);

  // Get the order's line items
  let lineItems = await api.shopifyOrderLineItem.findMany({
    filter: {
      orderId: {
        equals: order.id,
      },
    },
    select: {
      id: true,
      reviewCreated: true,
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

  const allLineItems = [...lineItems];

  // Paginate through all line items if there are more than the initial page
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
    reviewCreated: boolean;
    lineItemId: string;
  }[] = [];

  for (const { id, reviewCreated, product } of allLineItems) {
    if (!product?.id) continue;

    if (!seen[product?.id]) {
      seen[product?.id] = true;
      products.push({
        id: product?.id,
        title: product.title ?? "",
        image: product.featuredMedia?.file?.url ?? "",
        alt: product.featuredMedia?.file?.alt ?? "",
        reviewCreated: reviewCreated ?? false,
        lineItemId: id,
      });
    }
  }

  return { orderId: order.id, products };
};

export const params = {
  code: {
    type: "string",
  },
};
