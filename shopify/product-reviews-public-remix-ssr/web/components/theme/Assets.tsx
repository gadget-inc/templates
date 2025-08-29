import { List, Text } from "@shopify/polaris";
import type { Asset } from "web/lib/utils/theme/types";
import CodeBlock from "./CodeBlock";

function Asset({ asset }: { asset: Asset }) {
  return (
    <List.Item>
      <Text as="p" variant="bodyMd">
        {asset.name}
      </Text>
      <CodeBlock title={asset.name} language={asset.type}>
        {asset.content}
      </CodeBlock>
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
