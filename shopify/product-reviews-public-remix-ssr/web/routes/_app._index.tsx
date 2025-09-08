import { AutoTable } from "@gadgetinc/react/auto/polaris";
import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  InlineStack,
  Layout,
  Page,
  Text,
  Tooltip,
} from "@shopify/polaris";
import { api } from "../api";
import Stars from "../components/review/Stars";
import ApprovalButton from "../components/review/ApprovalButton";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useState, useEffect, useCallback } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

export async function loader({ context }: LoaderFunctionArgs) {
  const [totalReviewsMoM, averageRatingMoM] = await Promise.all([
    context.api.review.totalReviews(),
    context.api.review.averageRating(),
  ]);

  return json({
    totalReviewsMoM,
    averageRatingMoM,
  });
}

function formatPercentageChange(percentageChange: number | null) {
  if (percentageChange === null) {
    return "No data";
  }

  return `${percentageChange >= 0 ? "+" : "-"}${Math.abs(percentageChange)}% MoM`;
}

export default function () {
  const { totalReviewsMoM, averageRatingMoM } = useLoaderData<typeof loader>();
  const [isClient, setIsClient] = useState(false);
  const [modalContent, setModelContent] = useState("");
  const [dismissed, setDismissed] = useState(false);

  // Only access app bridge on the client side
  const appBridge = isClient ? useAppBridge() : null;
  const navigate = useNavigate();

  const handleDismiss = useCallback(() => {
    setDismissed((prev) => !prev);
    // Suggestion: Add a permanent flag to the database to persist the dismissal
  }, [setDismissed]);

  // Set isClient to true when component mounts on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Page title="Reviews">
      <Layout>
        {!dismissed && (
          <Layout.Section>
            <Banner
              title="Install your app extension"
              onDismiss={() => handleDismiss()}
            >
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  Run <code>yarn shopify:dev</code>, in the Gadget terminal, to
                  run your extension. Then install it on your store's theme to
                  start using the app.
                </Text>
                <InlineStack>
                  <Button onClick={() => navigate("/install")}>
                    Installation guide
                  </Button>
                </InlineStack>
              </BlockStack>
            </Banner>
          </Layout.Section>
        )}
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text as="h3" variant="headingMd">
                Monthly statistics
              </Text>
              <InlineStack wrap={false} gap="400" align="space-around">
                <BlockStack gap="200">
                  <Text as="h2" variant="bodyLg">
                    Total reviews
                  </Text>
                  <InlineStack gap="200" align="center" blockAlign="center">
                    <Text as="span" variant="headingLg">
                      {totalReviewsMoM.currentMonthTotal}
                    </Text>
                    <Text as="span" variant="bodySm" tone="subdued">
                      {formatPercentageChange(totalReviewsMoM.percentageChange)}
                    </Text>
                  </InlineStack>
                </BlockStack>
                <BlockStack gap="200">
                  <Text as="h2" variant="bodyLg">
                    Average rating
                  </Text>
                  <InlineStack gap="200" align="center" blockAlign="center">
                    <Text as="span" variant="headingLg">
                      {averageRatingMoM.currentAverageRating}
                    </Text>
                    <Text as="span" variant="bodySm" tone="subdued">
                      {formatPercentageChange(
                        averageRatingMoM.percentageChange
                      )}
                    </Text>
                  </InlineStack>
                </BlockStack>
              </InlineStack>
            </BlockStack>
          </Card>
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
