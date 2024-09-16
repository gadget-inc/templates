import React, { useEffect, useState } from "react";
import {
  reactExtension,
  Divider,
  Image,
  Banner,
  Heading,
  Button,
  InlineLayout,
  BlockStack,
  Text,
  SkeletonText,
  SkeletonImage,
  useCartLines,
  useApplyCartLinesChange,
  useApi,
  useAppMetafields,
} from "@shopify/ui-extensions-react/checkout";
// Set up the entry point for the extension
export default reactExtension("purchase.checkout.block.render", () => <App />);

function App() {
  const { query, i18n } = useApi();
  const applyCartLinesChange = useApplyCartLinesChange();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showError, setShowError] = useState(false);
  const lines = useCartLines();

  // get value from metafield
  const [prePurchaseProduct] = useAppMetafields({
    namespace: "gadget-tutorial",
    key: "pre-purchase-product",
  });

  useEffect(() => {
    if (prePurchaseProduct) {
      fetchProduct(prePurchaseProduct);
    }
  }, [prePurchaseProduct]);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  // handle the add to cart button click, add product to cart
  async function handleAddToCart(variantId) {
    setAdding(true);
    const result = await applyCartLinesChange({
      type: "addCartLine",
      merchandiseId: variantId,
      quantity: 1,
    });
    setAdding(false);
    if (result.type === "error") {
      setShowError(true);
      console.error(result.message);
    }
  }

  // fetch product variant and image from storefront API
  async function fetchProduct(prePurchaseProduct) {
    setLoading(true);
    try {
      const { data } = await query(
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
      );
      setProduct(data.product);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  // loading is done and no product - don't render anything
  if (!loading && !product) {
    return null;
  }

  // don't offer the product if it is already in the cart
  const productOnOffer = getProductOnOffer(lines, product);
  if (!productOnOffer) {
    return null;
  }

  return (
    <ProductOffer
      product={productOnOffer}
      i18n={i18n}
      adding={adding}
      handleAddToCart={handleAddToCart}
      showError={showError}
    />
  );
}

function LoadingSkeleton() {
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

function getProductOnOffer(lines, product) {
  const cartLineProductVariantIds = lines.map((item) => item.merchandise.id);
  const isProductVariantInCart = !!product.variants.nodes.some(({ id }) =>
    cartLineProductVariantIds.includes(id)
  );

  if (!isProductVariantInCart) {
    return product;
  }
  return null;
}

function ProductOffer({ product, i18n, adding, handleAddToCart, showError }) {
  const { images, title, variants } = product;
  const renderPrice = i18n.formatCurrency(variants.nodes[0].price.amount);
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
            onPress={() => handleAddToCart(variants.nodes[0].id)}
          >
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
      {showError && <ErrorBanner />}
    </BlockStack>
  );
}

function ErrorBanner() {
  return (
    <Banner status="critical">
      There was an issue adding this product. Please try again.
    </Banner>
  );
}