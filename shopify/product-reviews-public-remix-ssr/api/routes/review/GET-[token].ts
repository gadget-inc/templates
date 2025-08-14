import { RouteHandler } from "gadget-server";
import { generateReviewTemplate } from "../../utils/review";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * Route handler for GET review/[token]
 *
 * See: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 */
const route: RouteHandler<{
  Params: {
    token: string;
  };
}> = async ({ request, reply, api, logger, connections }) => {
  if (!connections.shopify.current) return await reply.status(401).send();

  const { token } = request.params;

  if (!token)
    return await reply
      .header("Content-Type", "application/liquid")
      .send(
        await readFile(join(__dirname, "liquid", "invalid.liquid"), "utf-8")
      );

  const order = await api.shopifyOrder.maybeFindFirst({
    filter: {
      reviewToken: {
        equals: token,
      },
      shopId: {
        equals: String(connections.shopify.currentShop?.id),
      },
    },
    select: {
      id: true,
      reviewCreationLimit: true,
    },
  });

  // Send invalid token UI
  if (!order)
    return await reply
      .header("Content-Type", "application/liquid")
      .send(
        await readFile(join(__dirname, "liquid", "invalid.liquid"), "utf-8")
      );

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
            image: true,
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
        image:
          (product.featuredMedia?.file?.image as { originalSrc: string })
            .originalSrc ?? "",
        alt: product.featuredMedia?.file?.alt ?? "",
        reviewCreated: reviewCreated ?? false,
        lineItemId: id,
      });
    }
  }

  await reply
    .header("Content-Type", "application/liquid")
    .send(generateReviewTemplate({ orderId: order.id, products }));
};

export default route;
