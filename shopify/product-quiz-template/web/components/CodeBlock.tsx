import { Text, Card, BlockStack, Button } from "@shopify/polaris";

export default ({ children }: { children: string }) => {
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
