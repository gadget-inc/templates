import { AutoForm, AutoTable } from "@gadgetinc/react/auto/polaris";
import { Card, Layout, Page, Text } from "@shopify/polaris";
import { api } from "../api";

export const IndexPage = () => {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <AutoForm action={api.allowedTag.create} title="Add keywords" />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Text as="h2" variant="headingLg">
              Keywords
            </Text>
            <AutoTable model={api.allowedTag} columns={["keyword"]} />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
