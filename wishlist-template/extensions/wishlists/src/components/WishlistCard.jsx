import {
  BlockStack,
  Card,
  Heading,
  ProductThumbnail,
  InlineStack,
  Pressable,
  Text,
  InlineLayout,
} from "@shopify/ui-extensions-react/customer-account";
import WishlistModal from "./WishlistModal.jsx";
import { SkeletonThumbnail } from "@shopify/polaris";

export default ({ id, name, image, itemCount }) => {
  return (
    <>
      <Pressable overlay={<WishlistModal {...{ id, name }} />}>
        <Card padding>
          <BlockStack spacing="loose">
            <InlineLayout blockAlignment="center" columns={["fill", "20%"]}>
              <InlineStack blockAlignment="center">
                <ProductThumbnail source={image?.url || SkeletonThumbnail} />
                <Heading>{name}</Heading>
              </InlineStack>
              <InlineStack inlineAlignment="end">
                <Text size="large">{itemCount || 0} items</Text>
              </InlineStack>
            </InlineLayout>
          </BlockStack>
        </Card>
      </Pressable>
    </>
  );
};
