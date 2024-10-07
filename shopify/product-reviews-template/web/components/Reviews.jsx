import { useParams } from "react-router-dom";
import { useGlobalAction } from "@gadgetinc/react";
import { api } from "../api";
import { BlockStack, Page } from "@shopify/polaris";
import ReviewCard from "./ReviewCard";
import StyledSpinner from "./StyledSpinner";
import { useEffect } from "react";

export default () => {
  const { code } = useParams();

  const [{ data, fetching, error }, fetchOrderData] = useGlobalAction(
    api.fetchOrderData
  );

  useEffect(() => {
    if (code) {
      void fetchOrderData({ code });
    }
  }, []);

  useEffect(() => {
    console.log({ code, data, fetching, error });
  }, [code, data, fetching, error]);

  if (fetching) {
    return (
      <Page>
        <StyledSpinner />
      </Page>
    );
  }

  return (
    <Page title={`Products on order #${data?.orderNumber}`}>
      <BlockStack gap="300">
        {data?.products?.map((product) => (
          <ReviewCard key={product.id} {...product} orderId={data?.orderId} />
        ))}
      </BlockStack>
    </Page>
  );
};
