import {
  BlockStack,
  Card,
  Layout,
  SkeletonBodyText,
  SkeletonPage,
} from "@shopify/polaris";

const ShopPage = () => {
  // This is where your app logic should go

  return (
    <SkeletonPage title="Dashboard" primaryAction>
      <Layout sectioned>
        <Layout.Section>
          <BlockStack gap="500">
            <Card sectioned>
              <SkeletonBodyText />
            </Card>
            <Card sectioned title="Images">
              <SkeletonBodyText />
            </Card>
            <Card sectioned title="Variants">
              <SkeletonBodyText />
            </Card>
          </BlockStack>
        </Layout.Section>
        <Layout.Section>
          <BlockStack gap="500">
            <Card title="Sales channels">
              <BlockStack gap="500">
                <SkeletonBodyText lines={2} />
                <SkeletonBodyText lines={1} />
              </BlockStack>
            </Card>
            <Card title="Organization" subdued>
              <BlockStack gap="500">
                <SkeletonBodyText lines={2} />
                <SkeletonBodyText lines={2} />
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
};

export default ShopPage;
