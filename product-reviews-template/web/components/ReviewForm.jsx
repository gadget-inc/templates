import { useParams, useSearchParams } from "react-router-dom";
import { useFindMany } from "@gadgetinc/react";

import { api } from "../api";
import { BlockStack, Page } from "@shopify/polaris";
import ProductCard from "./ProductCard";
import StyledSpinner from "./StyledSpinner";

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

  if (fetchingProducts) {
    return (
      <Page>
        <StyledSpinner />
      </Page>
    );
  }

  return (
    <Page title={`Products on order #${searchParams.get("orderNumber")}`}>
      <BlockStack gap="300">
        {products?.map(({ id, title }) => (
          <ProductCard key={id} {...{ id, title, orderId }} />
        ))}
      </BlockStack>
    </Page>
  );
};
