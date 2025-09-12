/**
 * This file is used to display the setup instructions for the app
 * It can be removed once the app is live
 * You may also remove the `react-markdown` once removing this file
 */

import { readFile } from "fs/promises";
import { join } from "path";
import Markdown, { type Components } from "react-markdown";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Link,
  List,
  Page,
  Text,
  BlockStack,
  Box,
  Card,
  Divider,
  Thumbnail,
  Layout,
  FooterHelp,
} from "@shopify/polaris";

// This loader is used to fetch the contents of the README.md file and loads the data into the route component
export async function loader() {
  const readme = await readFile(join(process.cwd(), "README.md"), "utf-8");

  // Filter out lines containing the fork template badge
  const filteredReadme = readme
    .split("\n")
    .filter((line) => !line.includes("[![Fork template]"))
    .join("\n");

  return json({ readme: filteredReadme });
}

export default function SetupPage() {
  const { readme } = useLoaderData<typeof loader>();

  const components: Components = {
    h1: () => <></>,
    h2: ({ children, ...props }) => (
      <Box>
        <Text as="h2" variant="headingMd" {...props}>
          {children}
        </Text>
      </Box>
    ),
    h3: ({ children, ...props }) => (
      <Box paddingBlockEnd="200">
        <Text as="h3" variant="headingSm" {...props}>
          {children}
        </Text>
      </Box>
    ),
    h4: ({ children, ...props }) => (
      <Box paddingBlockEnd="100">
        <Text as="h4" variant="headingXs" {...props}>
          {children}
        </Text>
      </Box>
    ),
    p: ({ children, ...props }) => (
      <Box>
        <Text as="p" variant="bodyMd" {...props}>
          {children}
        </Text>
      </Box>
    ),
    ul: ({ children }) => (
      <Box>
        <List>{children}</List>
      </Box>
    ),
    ol: ({ children }) => (
      <Box>
        <List type="number">{children}</List>
      </Box>
    ),
    li: ({ children }) => <List.Item>{children}</List.Item>,
    blockquote: ({ children, ...props }) => (
      <Box>
        <Card>
          <Box padding="300">
            <BlockStack gap="200">
              <Box borderInlineStartWidth="025" paddingInlineStart="300">
                <Text as="p" variant="bodyMd" tone="subdued" {...props}>
                  {children}
                </Text>
              </Box>
            </BlockStack>
          </Box>
        </Card>
      </Box>
    ),
    code: ({ children, ...props }) => (
      <Text
        as="span"
        variant="bodySm"
        tone="subdued"
        fontWeight="semibold"
        {...props}
      >
        {children}
      </Text>
    ),
    pre: ({ children, ...props }) => (
      <Box>
        <Card>
          <Box padding="300">
            <Box
              background="bg-surface-secondary"
              padding="300"
              borderRadius="200"
              overflowX="scroll"
            >
              <Text as="span" variant="bodySm" tone="subdued" {...props}>
                {children}
              </Text>
            </Box>
          </Box>
        </Card>
      </Box>
    ),
    a: ({ children, href }) => (
      <Link url={href} target={href?.startsWith("http") ? "_blank" : "_top"}>
        {children}
      </Link>
    ),
    strong: ({ children, ...props }) => (
      <Text as="strong" variant="bodyMd" fontWeight="semibold" {...props}>
        {children}
      </Text>
    ),
    em: ({ children, ...props }) => (
      <Text as="span" variant="bodyMd" tone="subdued" {...props}>
        {children}
      </Text>
    ),
    hr: ({ ...props }) => (
      <Box paddingBlock="400">
        <Divider {...props} />
      </Box>
    ),
    img: ({ src, alt, ...props }) => (
      <Thumbnail source={src || ""} alt={alt || ""} size="large" {...props} />
    ),
  };

  return (
    <Page title="Template setup">
      <Layout sectioned>
        <Layout.Section>
          <BlockStack gap="400">
            <Markdown components={components}>{readme}</Markdown>
          </BlockStack>
        </Layout.Section>
      </Layout>
      {/* Used to add spacing to the bottom of the page */}
      <FooterHelp></FooterHelp>
    </Page>
  );
}
