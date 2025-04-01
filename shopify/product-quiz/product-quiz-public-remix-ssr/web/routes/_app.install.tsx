import {
  BlockStack,
  Button,
  Card,
  InlineStack,
  Layout,
  Text,
  Divider
} from "@shopify/polaris";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageLayout from "../components/PageLayout";
import rawQuizPageLiquid from "../../extensions/quiz/blocks/quiz.liquid?raw";
import rawProductQuizJs from "../../extensions/quiz/assets/q.js?raw";

const pageQuizJson = `{
  "sections": {
    "main": {
      "type": "quiz-page",
      "settings": {}
    }
  },
  "order": ["main"]
}`;

export async function loader({ context }: LoaderFunctionArgs) {
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

const CodeBlock = ({ children }: { children: string; }) => {
  return (
    <Card>
      <BlockStack inlineAlign="end">
        <Button onClick={() => navigator.clipboard.writeText(children)}>
          Copy
        </Button>
      </BlockStack>
      <Text as="p" tone="subdued">
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          <code>{children}</code>
        </pre>
      </Text>
    </Card>
  );
};

export default function Install() {
  const { theme, shop } = useLoaderData<typeof loader>();

  if (!theme.onlineStore2) {
    return (
      <PageLayout>
        <BlockStack gap="500">
          <BlockStack gap="300">
            <Text as="p">
              Head over to your theme, hit edit code. Under Sections, create a new
              section called quiz-page.liquid. We're going to replace this page with
              the following code:
            </Text>
            <CodeBlock>{rawQuizPageLiquid}</CodeBlock>
          </BlockStack>
          <Divider />
          <BlockStack gap="300">
            <Text as="p">
              Now under Templates, select “Add a new template” and add a template
              called page.quiz.json. This requires you to select the page template
              type.
            </Text>
            <Text as="p">Replace the generated file with the following JSON:</Text>
            <CodeBlock>{pageQuizJson}</CodeBlock>
          </BlockStack>
          <Divider />
          <BlockStack gap="300">
            <Text as="p">
              Under the Assets section in the sidebar, select Add a new asset and
              create a new JavaScript file called product-quiz.js. You can then add
              the following to that file:
            </Text>
            <CodeBlock>{rawProductQuizJs}</CodeBlock>
          </BlockStack>
          <Divider />
          <BlockStack>
            <Text as="p">
              Save your changes, and we're ready to go! Head over to the Pages
              section of the Shopify admin, and create a new page for your quiz. You
              can set the template to use your new quiz template. View the page to
              see your quiz right in your Shopify store, ready to recommend products
              to your shoppers.
            </Text>
          </BlockStack>
        </BlockStack>
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
              <Text as="p" variant="bodyLg">
                Before adding the product quiz to your store, we recommend that
                you first create a quiz. This can be done from the New quiz
                page, found either from the left navigation menu or via the
                application's homepage.
              </Text>
              <Text as="p" variant="bodyLg">
                Once you've created a quiz, you can add it to your store by:
              </Text>
              <BlockStack gap="400">
                <Text as="p" variant="bodyLg">
                  Copying the slug of the quiz, from the homepage of this
                  application.
                </Text>
                <img
                  src="/assets/pet-quiz.png"
                  alt="Quiz slug location on quiz card"
                />
                <Text as="p" variant="bodyLg">
                  Clicking the "Add to theme" button to the top right of this
                  card.
                </Text>
                <InlineStack align="center">
                  <img
                    src="/assets/add-to-theme.png"
                    alt="Add to theme button"
                    width="100px"
                  />
                </InlineStack>
                <Text as="p" variant="bodyLg">
                  Clicking on the product quiz section in the editor, in the
                  left page items navigation.
                </Text>
                <img
                  src="/assets/editor-left-nav.png"
                  alt="Left Shopify theme editor navigation"
                />
                <Text as="p" variant="bodyLg">
                  Pasting the slug into the "Quiz slug" field in the product
                  quiz settings section.
                </Text>
                <img src="/assets/quiz-section.png" alt="Quiz slug input" />
              </BlockStack>
              <Text as="p" variant="bodyLg">
                You're all done! Customers can now use your quiz to find the
                perfect product for them.
              </Text>
            </BlockStack>
          </BlockStack>
        </Card>
      </Layout.Section>
    </PageLayout>
  );
}
