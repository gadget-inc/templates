import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { BlockStack } from "@shopify/polaris";
import ReviewCard from "../components/ReviewCard";

export async function loader({ context, params }: LoaderFunctionArgs) {
  if (!params.code) {
    return redirect("/invalid");
  }
  let data;

  try {
    const order =
      await context.api.actAsAdmin.shopifyOrder.maybeFindByReviewToken(
        params.code,
        {
          select: {
            id: true,
            reviewCreationLimit: true,
          },
        }
      );

    // If no order is found, throw an error
    if (!order)
      throw new Error(`Order attributed with code '${params.code}' not found`);

    // Get the order's line items
    let lineItems = await context.api.actAsAdmin.shopifyOrderLineItem.findMany({
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

    data = { orderId: order.id, products };
  } catch (error) {
    return redirect("/invalid");
  }

  return json(data);
}

export default function () {
  const { orderId, products } = useLoaderData<typeof loader>();

  return (
    <BlockStack>
      {products.map((product) => (
        <ReviewCard key={product.id} {...product} orderId={orderId} />
      ))}
    </BlockStack>
  );
}
