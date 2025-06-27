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
    data = await context.api.fetchOrderData({ code: params.code });
  } catch (error) {
    return redirect("/invalid");
  }

  if (!data) {
    return redirect("/invalid");
  }

  return json({
    data,
  });
}

export default function () {
  const { data } = useLoaderData<typeof loader>();

  return (
    <BlockStack>
      {(
        data as {
          orderId: string;
          orderNumber: string;
          products: {
            lineItemId: string;
            reviewCreated: boolean;
            id: string;
            title: string;
            image: string;
            alt: string;
          }[];
        }
      ).products.map((product) => (
        <ReviewCard key={product.id} {...product} orderId={data.orderId} />
      ))}
    </BlockStack>
  );
}
