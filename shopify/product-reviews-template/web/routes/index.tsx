import { AutoTable } from "@gadgetinc/react/auto/polaris";
import {
  BlockStack,
  Box,
  Card,
  Layout,
  Page,
  Text,
  Tooltip,
} from "@shopify/polaris";
import { api } from "../api";
import { ApprovalButton, Stars } from "../components";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useState } from "react";

export default function () {
  const { toast, modal } = useAppBridge();
  const [modalContent, setModelContent] = useState("");

  return (
    <Page title="Reviews">
      <Layout>
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
                          modal.show("review-content-modal");
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
                    <ApprovalButton {...{ record, toast }} />
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
