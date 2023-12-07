import {
  Banner,
  BlockStack,
  Button,
  Divider,
  Heading,
  Image,
  InlineLayout,
  SkeletonImage,
  SkeletonText,
  Text,
  reactExtension,
  useApi,
  useAppMetafields,
  useApplyCartLinesChange,
  useCartLines,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  // Use `query` for fetching product data from the Storefront API, and use `i18n` to format
  // currencies, numbers, and translate strings
  const { query, i18n } = useApi();
  // Get a reference to the function that will apply changes to the cart lines from the imported hook
  const applyCartLinesChange = useApplyCartLinesChange();

  // get passed in metafield
  const [prePurchaseProduct] = useAppMetafields();

  // Set up the states
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showError, setShowError] = useState(false);

  // On initial load, fetch the product variants
  useEffect(() => {
    if (prePurchaseProduct) {
      // Set the loading state to show some UI if you're waiting
      setLoading(true);
      // Use `query` api method to send graphql queries to the Storefront API
      query(
        `query ($id: ID!) {
        product(id: $id) {
          id
          title
          images(first:1){
            nodes {
              url
            }
          }
          variants(first: 1) {
            nodes {
              id
              price {
                amount
              }
            }
          }
        }
      }`,
        {
          variables: { id: prePurchaseProduct.metafield.value },
        }
      )
        .then(({ data }) => {
          // Set the `product` so that you can reference it
          setProduct(data.product);
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [prePurchaseProduct]);

  // If an offer is added and an error occurs, then show some error feedback using a banner
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  // Access the current cart lines and subscribe to changes
  const lines = useCartLines();

  // Show a loading UI if you're waiting for product variant data
  // Use Skeleton components to keep placement from shifting when content loads
  if (loading) {
    return (
      <BlockStack spacing="loose">
        <Divider />
        <Heading level={2}>You might also like</Heading>
        <BlockStack spacing="loose">
          <InlineLayout
            spacing="base"
            columns={[64, "fill", "auto"]}
            blockAlignment="center"
          >
            <SkeletonImage aspectRatio={1} />
            <BlockStack spacing="none">
              <SkeletonText inlineSize="large" />
              <SkeletonText inlineSize="small" />
            </BlockStack>
            <Button kind="secondary" disabled={true}>
              Add
            </Button>
          </InlineLayout>
        </BlockStack>
      </BlockStack>
    );
  }
  // If product variants can't be loaded, then show nothing
  if (!loading && !product) {
    return null;
  }

  // Get the IDs of all product variants in the cart
  const cartLineProductVariantIds = lines.map((item) => item.merchandise.id);

  // check to see if the product is already in the cart
  const productInCart = !!product.variants.nodes.some(({ id }) =>
    cartLineProductVariantIds.includes(id)
  );

  // If the product is in the cart, then don't show the offer
  if (productInCart) {
    return null;
  }

  // Choose the first available product variant on offer
  const { images, title, variants } = product;

  // Localize the currency for international merchants and customers
  const renderPrice = i18n.formatCurrency(variants.nodes[0].price.amount);

  // Use the first product image or a placeholder if the product has no images
  const imageUrl =
    images.nodes[0]?.url ??
    "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081";

  return (
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing="loose">
        <InlineLayout
          spacing="base"
          // Use the `columns` property to set the width of the columns
          // Image: column should be 64px wide
          // BlockStack: column, which contains the title and price, should "fill" all available space
          // Button: column should "auto" size based on the intrinsic width of the elements
          columns={[64, "fill", "auto"]}
          blockAlignment="center"
        >
          <Image
            border="base"
            borderWidth="base"
            borderRadius="loose"
            source={imageUrl}
            description={title}
            aspectRatio={1}
          />
          <BlockStack spacing="none">
            <Text size="medium" emphasis="strong">
              {title}
            </Text>
            <Text appearance="subdued">{renderPrice}</Text>
          </BlockStack>
          <Button
            kind="secondary"
            loading={adding}
            accessibilityLabel={`Add ${title} to cart`}
            onPress={async () => {
              setAdding(true);
              // Apply the cart lines change
              const result = await applyCartLinesChange({
                type: "addCartLine",
                merchandiseId: variants.nodes[0].id,
                quantity: 1,
              });
              setAdding(false);
              if (result.type === "error") {
                // An error occurred adding the cart line
                // Verify that you're using a valid product variant ID
                // For example, 'gid://shopify/ProductVariant/123'
                setShowError(true);
                console.error(result.message);
              }
            }}
          >
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
      {showError && (
        <Banner status="critical">
          There was an issue adding this product. Please try again.
        </Banner>
      )}
    </BlockStack>
  );
}
