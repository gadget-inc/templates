import { useParams, useNavigate } from "react-router-dom";
import { useGlobalAction } from "@gadgetinc/react";
import { api } from "../api";
import { BlockStack, Page } from "@shopify/polaris";
import ReviewCard from "./ReviewCard";
import StyledSpinner from "./StyledSpinner";
import { useEffect } from "react";

export default () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [{ data, fetching, error }, fetchOrderData] = useGlobalAction(
    api.fetchOrderData
  );

  useEffect(() => {
    if (code) {
      void fetchOrderData({ code });
    }
  }, []);

  useEffect(() => {
    if (
      !fetching &&
      error &&
      error.message.includes("Single use code not found")
    ) {
      navigate("/expired");
    }
  }, [fetching, error]);

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
