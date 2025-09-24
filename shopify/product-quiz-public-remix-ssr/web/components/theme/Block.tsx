import { useLoaderData } from "@remix-run/react";
import { Block } from "../../lib/utils/theme/types";
import { loader } from "../../routes/_app.install";
import { useAppBridge } from "@shopify/app-bridge-react";
import { BlockStack, Button, ButtonGroup, Card, Text } from "@shopify/polaris";

function BlockCard({
  block,
  setBlock,
}: {
  block: Block;
  setBlock: (block: Block) => void;
}) {
  const shopify = useAppBridge();

  return (
    <div>
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd">
            {block.name}
          </Text>
          <Text as="p" variant="bodyMd">
            {block.description}
          </Text>
          <ButtonGroup>
            <Button
              onClick={() => {
                setBlock(block);
                shopify.modal.show("extension-installation-modal");
              }}
            >
              Install guide
            </Button>
          </ButtonGroup>
        </BlockStack>
      </Card>
    </div>
  );
}

export default function ({ setBlock }: { setBlock: (block: Block) => void }) {
  const { blocks } = useLoaderData<typeof loader>();

  return (
    <BlockStack>
      {blocks.map((block) => (
        <BlockCard key={block.name} {...{ block, setBlock }} />
      ))}
    </BlockStack>
  );
}
