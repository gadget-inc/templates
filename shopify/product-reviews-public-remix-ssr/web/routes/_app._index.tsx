import { AutoTable } from "@gadgetinc/react/auto/polaris";
import {
  BlockStack,
  Box,
  Card,
  InlineStack,
  Layout,
  Page,
  Text,
  Tooltip,
} from "@shopify/polaris";
import { api } from "../api";
import Stars from "../components/Stars";
import ApprovalButton from "../components/ApprovalButton";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useState, useEffect } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  let shopId = await context.session?.get("roles");

  // const shop = await context.api.shopifyShop.maybeFindFirst({
  //   select: {
  //     id: true,
  //   },
  // });

  // shopId = shop?.id ?? shopId;

  context.logger.info({ shopId: shopId ?? "null" }, "Shop ID");

  const [totalReviewsMoM, averageRatingMoM] = await Promise.all([
    context.api.review.totalReviews(),
    context.api.review.averageRating(),
  ]);

  context.logger.info(
    {
      totalReviewsMoM,
      averageRatingMoM,
    },
    "Total Reviews and Average Rating"
  );

  return json({
    totalReviewsMoM,
    averageRatingMoM,
  });
};

export default function () {
  const [isClient, setIsClient] = useState(false);
  const [modalContent, setModelContent] = useState("");

  // Only access app bridge on the client side
  const appBridge = isClient ? useAppBridge() : null;

  // Set isClient to true when component mounts on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Page title="Reviews">
      <Layout>
        <Layout.Section>
          <InlineStack blockAlign="center">
            <Card></Card>
          </InlineStack>
        </Layout.Section>
        <Layout.Section>
          <Card padding="0">
            <AutoTable
              model={api.review}
              select={{
                id: true,
                rating: true,
                anonymous: true,
                approved: true,
                product: {
                  title: true,
                },
                content: true,
                customer: { firstName: true, lastName: true },
              }}
              selectable={false}
              columns={[
                {
                  field: "product.title",
                  header: "Product",
                  render: ({
                    record: {
                      product: { title },
                    },
                  }) => (
                    <Tooltip content={title}>
                      <Text as="span" variant="bodyMd" truncate>
                        {title}
                      </Text>
                    </Tooltip>
                  ),
                },
                {
                  field: "content",
                  header: "Review",
                  render: ({ record: { content } }) => (
                    <Tooltip {...{ content }}>
                      <div
                        onClick={() => {
                          setModelContent(content);
                          if (isClient && appBridge?.modal) {
                            appBridge.modal.show("review-content-modal");
                          }
                        }}
                      >
                        <Text as="span" variant="bodyMd" truncate>
                          {content}
                        </Text>
                      </div>
                    </Tooltip>
                  ),
                },
                { field: "customer.firstName", header: "Customer" },
                {
                  field: "rating",
                  header: "Rating",
                  render: ({ record }) => <Stars rating={record.rating} />,
                },
                {
                  field: "approved",
                  header: "",
                  render: ({ record }) => (
                    <ApprovalButton {...{ record, toast: appBridge?.toast }} />
                  ),
                },
              ]}
            />
          </Card>
        </Layout.Section>
        <ui-modal id="review-content-modal">
          <BlockStack gap="300">
            <ui-title-bar title="Review" />
            <Box padding="300">
              <Text as="p" variant="bodyMd">
                {modalContent}
              </Text>
            </Box>
          </BlockStack>
        </ui-modal>
      </Layout>
    </Page>
  );
}
