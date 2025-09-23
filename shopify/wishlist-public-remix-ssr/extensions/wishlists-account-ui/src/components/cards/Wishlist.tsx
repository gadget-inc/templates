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
import Modal from "../modals/Update";

export default ({
  id,
  name,
  image,
  itemCount,
}: {
  id: string;
  name: string;
  image: { url: string };
  itemCount: number;
}) => {
  return (
    <>
      <Pressable overlay={<Modal {...{ id, name }} />}>
        <Card padding>
          <BlockStack spacing="loose">
            <InlineLayout blockAlignment="center" columns={["fill", "20%"]}>
              <InlineStack blockAlignment="center">
                <ProductThumbnail source={image?.url || ""} />
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
