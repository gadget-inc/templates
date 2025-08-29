import { Card, Link, Page, Text } from '@shopify/polaris';

export default function() {
  return (
    <Page>
      <Card >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Text variant="heading3xl" as="h2">404</Text>
          <Text variant="headingMd" as="h6">Page Not Found</Text>
          <Link url='/'>Return to Home</Link>
        </div>
      </Card>
    </Page>
  );
}
