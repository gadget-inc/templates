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
import { useAppBridge, Modal } from "@shopify/app-bridge-react";
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
  const [selectedReview, setSelectedReview] = useState<any>(null);
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
                  render: ({ record }) => (
                    <Tooltip content={record.content}>
                      <div
                        onClick={() => {
                          setSelectedReview(record);
                          if (isClient && appBridge?.modal) {
                            appBridge.modal.show("review-content-modal");
                          }
                        }}
                      >
                        <Text as="span" variant="bodyMd" truncate>
                          {record.content}
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
        <Modal id="review-content-modal">
          {selectedReview && (
            <BlockStack gap="400">
              <Box padding="400">
                <BlockStack gap="300">
                  {/* Header with product and rating */}
                  <InlineStack align="space-between" blockAlign="start">
                    <BlockStack gap="200">
                      <Text as="h2" variant="headingMd">
                        {selectedReview.product?.title}
                      </Text>
                    </BlockStack>
                    <Stars rating={selectedReview.rating} />
                  </InlineStack>

                  {/* Customer information */}
                  <Box padding="300" background="bg-surface-secondary">
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">
                        Customer Information
                      </Text>
                      <InlineStack gap="400">
                        <Text as="p" variant="bodyMd">
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            Name:
                          </Text>{" "}
                          {selectedReview.customer?.firstName.trim() || ""}{" "}
                          {selectedReview.customer?.lastName.trim() || ""}
                        </Text>
                        <Text as="p" variant="bodyMd">
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            Status:
                          </Text>{" "}
                          <Text
                            as="span"
                            variant="bodyMd"
                            tone={
                              selectedReview.approved ? "success" : "critical"
                            }
                          >
                            {selectedReview.approved
                              ? "Approved"
                              : "Pending Approval"}
                          </Text>
                        </Text>
                      </InlineStack>
                    </BlockStack>
                  </Box>

                  {/* Review content */}
                  <Box padding="300" background="bg-surface">
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">
                        Review Content
                      </Text>
                      <Text as="p" variant="bodyMd">
                        {selectedReview.content}
                      </Text>
                    </BlockStack>
                  </Box>

                  {/* Review metadata */}
                  <Box padding="300" background="bg-surface-secondary">
                    <BlockStack gap="200">
                      <Text as="h3" variant="headingSm">
                        Review Details
                      </Text>
                      <InlineStack gap="400" wrap={false}>
                        <Text as="p" variant="bodyMd">
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            Rating:
                          </Text>{" "}
                          {selectedReview.rating} stars
                        </Text>
                        <Text as="p" variant="bodyMd">
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            Anonymous:
                          </Text>{" "}
                          {selectedReview.anonymous ? "Yes" : "No"}
                        </Text>
                      </InlineStack>
                    </BlockStack>
                  </Box>
                </BlockStack>
              </Box>
            </BlockStack>
          )}
        </Modal>
      </Layout>
    </Page>
  );
}
