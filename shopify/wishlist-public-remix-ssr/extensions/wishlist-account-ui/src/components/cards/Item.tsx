import {
  BlockStack,
  Button,
  Card,
  Heading,
  HeadingGroup,
  InlineLayout,
  InlineStack,
  ProductThumbnail,
  Tag,
  Text,
  useI18n,
  useNavigation,
} from "@shopify/ui-extensions-react/customer-account";
import { api } from "../../api";
import { useAction } from "@gadgetinc/react";
import { useCallback, useContext } from "react";
import { ShopContext } from "../../providers/Shop";
import type { JSONValue } from "@gadget-client/wishlist-public-remix-ssr";

export default ({
  id,
  title,
  price,
  compareAtPrice,
  deleted,
  inventoryQuantity,
  product: {
    title: productTitle,
    status,
    handle,
    featuredMedia: {
      file: { image, alt },
    },
  },
}: {
  id: string;
  title: string;
  price: string;
  compareAtPrice: string;
  deleted: boolean;
  inventoryQuantity: number;
  product: {
    title: string;
    status: string;
    handle: string;
    featuredMedia: {
      file: {
        image: JSONValue;
        alt: string;
      };
    };
  };
}) => {
  const { shop } = useContext(ShopContext);

  const { navigate } = useNavigation();
  // Formatting for the customer's currency
  const { formatCurrency } = useI18n();

  // Hook for deleting a wishlist item
  const [{ fetching: fetchingDeletion }, deleteWishlistItem] = useAction(
    api.wishlistItem.delete
  );

  // Callback for handling deletion of a wishlist item
  const handleDelete = useCallback(async () => {
    await deleteWishlistItem({ id });
  }, [id]);

  return (
    <Card padding>
      <BlockStack>
        <InlineLayout blockAlignment="start" columns={["fill", "20%"]}>
          <InlineStack>
            <ProductThumbnail
              // Gotta fix this
              source={
                (image as { originalSrc: string })?.originalSrc ??
                "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081"
              }
              alt={alt ?? "Product placeholder"}
            />
            <BlockStack spacing="extraTight">
              <HeadingGroup>
                <Heading>
                  {productTitle}
                  {title !== "Default Title" && ` - ${title}`}
                </Heading>
              </HeadingGroup>
              {!deleted && status === "active" ? (
                <InlineStack blockAlignment="center">
                  <Text
                    size="medium"
                    appearance={compareAtPrice ? "subdued" : undefined}
                  >
                    {compareAtPrice
                      ? formatCurrency(parseFloat(compareAtPrice))
                          .split("")
                          .map((char: string) => char + "\u0336")
                          .join("")
                      : formatCurrency(parseFloat(price))}
                  </Text>
                  {compareAtPrice && (
                    <Tag icon="discount">
                      {formatCurrency(parseFloat(compareAtPrice))}
                    </Tag>
                  )}
                </InlineStack>
              ) : (
                <Text appearance="critical" emphasis="bold">
                  No longer available
                </Text>
              )}
            </BlockStack>
          </InlineStack>
          <InlineStack inlineAlignment="end">
            <Text>
              {!deleted &&
                status === "active" &&
                (!!inventoryQuantity
                  ? `${inventoryQuantity} available`
                  : "Out of stock")}
            </Text>
          </InlineStack>
        </InlineLayout>
        <InlineLayout blockAlignment="start" columns={["50%", "50%"]}>
          <InlineStack>
            <Button
              loading={fetchingDeletion}
              onPress={handleDelete}
              appearance="monochrome"
              kind="secondary"
            >
              Remove
            </Button>
          </InlineStack>
          <InlineStack inlineAlignment="end">
            <Button
              disabled={deleted || status !== "active"}
              appearance="monochrome"
              onPress={() =>
                navigate(
                  `https://${shop?.domain}/products/${handle}?variant=${id}`
                )
              }
            >
              Buy
            </Button>
          </InlineStack>
        </InlineLayout>
      </BlockStack>
    </Card>
  );
};
