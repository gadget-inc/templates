import {
  BlockStack,
  Button,
  Card,
  InlineStack,
  Layout,
  List,
  Text,
} from "@shopify/polaris";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageLayout from "../components/PageLayout";

export async function loader({ context }: LoaderFunctionArgs) {
  context.logger.info("Loading installation instructions");

  const shopify = context.connections.shopify.current;

  if (!shopify) {
    throw new Error("No current Shopify connection context");
  }

  const response = await shopify.graphql(`
    query {
      themes(first: 1, roles: [MAIN]) {
        nodes {
          name
          id
          files (first: 250, filenames: ["templates/*.json"]) {
            nodes {
              filename
            }
          }
        }
      }
    }
  `);

  const { themes } = response;
  const theme = {
    onlineStore2: true,
    name: themes.nodes[0].name,
    id: themes.nodes[0].id.split("/").pop(),
  };

  if (!themes.nodes[0].files.nodes.length) {
    theme.onlineStore2 = false;
  }

  return json({
    theme,
    shop: await context.api.shopifyShop.findFirst({
      select: {
        domain: true,
      },
    }),
  });
}

export default function Install() {
  const { theme, shop } = useLoaderData<typeof loader>();

  if (!theme.onlineStore2) {
    return (
      <PageLayout>
        <></>
      </PageLayout>
    );
  }

  return (
    <PageLayout backAction={{ onAction: () => history.back() }}>
      <Layout.Section>
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <Text as="h1" variant="headingLg">
                Installation instructions
              </Text>
              <Button
                variant="primary"
                target="_blank"
                url={`https://${shop.domain}/admin/themes/${theme.id}/editor?addAppBlockId=${process.env.GADGET_PUBLIC_SHOPIFY_THEME_EXTENSION_ID}/quiz&target=newAppsSection`}
              >
                Add to theme
              </Button>
            </InlineStack>
            <BlockStack gap="300">
              <Text as="p">
                Before adding the product quiz to your store, we recommend that
                you first create a quiz. This can be done from the New quiz
                page, found either from the left navigation menu or via the
                application's homepage.
              </Text>
              <Text as="p">
                Once you've created a quiz, you can add it to your store by:
              </Text>
              <List type="number" gap="loose">
                <List.Item>
                  Copying the slug of the quiz, from the homepage of this
                  application.
                </List.Item>
                <List.Item>
                  Clicking the "Add to theme" button to the top right of this
                  card.
                </List.Item>
                <List.Item>
                  Clicking on the product quiz section in the editor, in the
                  left page items navigation.
                </List.Item>
                <List.Item>
                  Pasting the slug into the "Quiz slug" field in the product
                  quiz settings section to the right of the screen
                </List.Item>
              </List>
              <Text as="p">
                You're all done! Customers can now use your quiz to find the
                perfect product for them.
              </Text>
            </BlockStack>
            <video muted autoPlay loop>
              <source src="/assets/store2Install.webm" type="video/webm" />
            </video>
          </BlockStack>
        </Card>
      </Layout.Section>
    </PageLayout>
  );
}
