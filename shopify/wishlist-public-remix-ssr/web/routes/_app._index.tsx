import { AutoForm } from "@gadgetinc/react/auto/polaris";
import {
  Banner,
  BlockStack,
  Button,
  Card,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { api } from "../api";
import { json, type LoaderFunctionArgs } from "@remix-run/router";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useCallback, useState } from "react";

export async function loader({ context }: LoaderFunctionArgs) {
  return json({
    shop: await context.api.shopifyShop.findFirst({
      select: {
        id: true,
      },
    }),
  });
}

export default function Index() {
  const { shop } = useLoaderData<typeof loader>();
  const [dismissed, setDismissed] = useState(false);

  const navigate = useNavigate();

  const handleDismiss = useCallback(() => {
    setDismissed((prev) => !prev);
    // Suggestion: Add a permanent flag to the database to persist the dismissal
  }, [setDismissed]);

  return (
    <Page>
      <Layout>
        {!dismissed && (
          <Layout.Section>
            <Banner
              title="Install your app extension"
              onDismiss={() => handleDismiss()}
            >
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  Run <code>yarn shopify:dev</code>, in the local terminal, to
                  run your extensions. Then install it on your store's theme to
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
            <AutoForm
              title="Notification frequency"
              action={api.shopifyShop.update}
              include={["defaultUpdateFrequency"]}
              findBy={shop.id}
              submitLabel="Save"
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
