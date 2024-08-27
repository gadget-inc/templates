import { AutoButton, AutoTable } from "@gadgetinc/react/auto/polaris";
import {
  Banner,
  BlockStack,
  Box,
  Card,
  Layout,
  Link,
  Page,
  Text,
} from "@shopify/polaris";
import { api } from "../api";
import { Stars } from "../components";

export default function () {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <AutoTable
            model={api.review}
            select={{
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
              { field: "content", header: "Review" },
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
                  <AutoButton
                    action={api.review.update}
                    variables={{ id: record.id, approved: !record.approved }}
                  >
                    {record.approved ? "Remove" : "Approve"}
                  </AutoButton>
                ),
              },
            ]}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
