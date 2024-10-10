import { AutoTable } from "@gadgetinc/react/auto/polaris";
import { BlockStack, Layout, Page, Text, Tooltip } from "@shopify/polaris";
import { api } from "../api";
import { ApprovalButton, Stars } from "../components";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useState } from "react";

export default function () {
  const { toast, modal } = useAppBridge();
  const [modalContent, setModelContent] = useState("");

  return (
    <Page>
      <Layout>
        <Layout.Section>
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
              customer: { firstName: true, lastName: true },
            }}
            selectable={false}
            columns={[
              { field: "product.title", header: "Product" },
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
        </Layout.Section>
        <ui-modal id="review-content-modal">
          <BlockStack gap="300">
            <ui-title-bar title="Review" />
            <Text variant="bodyMd">{modalContent}</Text>
          </BlockStack>
        </ui-modal>
      </Layout>
    </Page>
  );
}
