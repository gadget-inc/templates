import { useParams, useSearchParams } from "react-router-dom";
import { useFindMany } from "@gadgetinc/react";

import { api } from "../api";
import { BlockStack, Page } from "@shopify/polaris";
import ProductCard from "./ProductCard";

export default () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();

  const [
    {
      data: products,
      fetching: fetchingProducts,
      error: errorFetchingProducts,
    },
  ] = useFindMany(api.shopifyProduct, {
    filter: {
      id: {
        in: searchParams.get("products").split(","),
      },
    },
    select: {
      id: true,
      title: true,
      images: {
        edges: {
          node: {
            source: true,
            alt: true,
          },
        },
      },
    },
  });

  console.log({
    orderId,
    products,
    orderNumber: searchParams.get("orderNumber"),
  });

  return (
    <Page>
      <BlockStack gap="300">
        {products?.map(({ id, title }) => (
          <ProductCard key={id} {...{ id, title, orderId }} />
        ))}
      </BlockStack>
    </Page>
  );
};
