import { BlockStack, List, Text } from "@shopify/polaris";
import type { Asset } from "web/lib/utils/theme/types";
import CodeBlock from "./CodeBlock";

function Asset({ asset }: { asset: Asset }) {
  return (
    <List.Item>
      <BlockStack gap="200">
        <Text as="p" variant="bodyMd">
          Create a file in the <strong>assets</strong> folder called{" "}
          <strong>{asset.name}</strong> and paste in the following snippet:
        </Text>
        <CodeBlock title={asset.name} language={asset.type}>
          {asset.content}
        </CodeBlock>
      </BlockStack>
    </List.Item>
  );
}

export default function Assets({ assets }: { assets: Asset[] }) {
  return (
    <>
      {assets.map((asset, key) => (
        <Asset key={key} {...{ asset }} />
      ))}
    </>
  );
}
