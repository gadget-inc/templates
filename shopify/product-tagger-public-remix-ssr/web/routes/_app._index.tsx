import { AutoForm, AutoTable } from "@gadgetinc/react/auto/polaris";
import { Card, Layout, Page, Text } from "@shopify/polaris";
import { api } from "../api";

export default function Index() {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            {/* This form allows users to add new keywords */}
            <AutoForm action={api.allowedTag.create} title="Add keywords" />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Text as="h2" variant="headingLg">
              Keywords
            </Text>
            {/* This table displays the allowed keywords for the Shopify product */}
            <AutoTable model={api.allowedTag} columns={["keyword"]} />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
