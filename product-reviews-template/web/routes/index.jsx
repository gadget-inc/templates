import { AutoTable } from "@gadgetinc/react/auto/polaris";
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
            excludeColumns={[
              "id",
              "anonymous",
              "metaobjectId",
              "createdAt",
              "updatedAt",
            ]}
            selectable={false}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
