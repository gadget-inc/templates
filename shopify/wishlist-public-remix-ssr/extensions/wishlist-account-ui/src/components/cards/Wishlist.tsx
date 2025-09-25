import {
  BlockStack,
  Card,
  Heading,
  ProductThumbnail,
  Pressable,
  Text,
  Divider,
  InlineStack,
  InlineLayout,
} from "@shopify/ui-extensions-react/customer-account";
import Modal from "../modals/Update";
import type { JSONValue } from "@gadget-client/wishlist-public-remix-ssr";

export default ({
  id,
  name,
  image,
  itemCount,
}: {
  id: string;
  name: string;
  image: { url: string };
  itemCount: JSONValue;
}) => {
  const count = (itemCount as number) || 0;
  const itemText = count === 1 ? "item" : "items";

  return (
    <Pressable overlay={<Modal {...{ id, name }} />}>
      <Card padding>
        <BlockStack spacing="base">
          {/* Image and main content */}
          <InlineLayout columns={["fill", "auto"]} spacing="base">
            {/* Main content area */}
            <BlockStack spacing="extraTight">
              <Heading level={3}>{name}</Heading>
              <Text appearance="subdued" size="medium">
                {count} {itemText}
              </Text>
            </BlockStack>
            {/* Product thumbnail with better styling */}
            <ProductThumbnail source={image?.url || ""} size="base" />
          </InlineLayout>

          {/* Subtle divider for visual separation */}
          <Divider />

          {/* Footer with action hint */}
          <Text appearance="subdued" size="small">
            Click to manage
          </Text>
        </BlockStack>
      </Card>
    </Pressable>
  );
};
