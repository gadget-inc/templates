import {
  Badge,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  Collapsible,
  Divider,
  InlineStack,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ImageIcon,
} from "@shopify/polaris-icons";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../providers";
import { ShopContextType } from "../providers/ShopProvider";
import { Tone } from "@shopify/polaris/build/ts/src/components/Badge";

export type Status = "active" | "archived" | "draft";

// A map for enums to the ton of a badge (Polaris)
const tones = {
  active: "success",
  archived: "complete",
  draft: "info",
};

export default ({
  id,
  title,
  description,
  status,
  price,
  bundleComponents,
  bundleComponentCount,
}: {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  price: number | null;
  bundleComponents: {
    edges: {
      node: {
        quantity: number | null;
        productVariant: {
          id: string;
          title: string | null;
          price: string | null;
          product: {
            id: string;
            title: string | null;
            images: { edges: { node: { source: string | null } }[] };
          } | null;
        } | null;
      };
    }[];
  } | null;
  bundleComponentCount: number;
}) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { shop }: { shop?: ShopContextType } = useContext(ShopContext);

  // Memoize the products array based on the bundle components array
  const products = useMemo(() => {
    const obj = (bundleComponents?.edges || []).reduce<{
      [key: string]: {
        id: string;
        title: string | null | undefined;
        image: string;
        variants: Array<{
          id: string | undefined;
          title: string | null | undefined;
          quantity: number | null;
          price: string | null | undefined;
        }>;
      };
    }>((acc, { node }) => {
      const { quantity, productVariant } = node;
      const {
        id: variantId,
        title: variantTitle,
        price: variantPrice,
      } = productVariant || {};
      const { id, title, images } = productVariant?.product || {};

      if (id) {
        if (!acc[id]) {
          acc[id] = {
            id,
            title,
            image: images?.edges[0]?.node?.source ?? "",
            variants: [
              {
                id: variantId,
                title: variantTitle,
                quantity,
                price: variantPrice,
              },
            ],
          };
        } else {
          acc[id].variants.push({
            id: variantId,
            title: variantTitle,
            quantity,
            price: variantPrice,
          });
        }
      }

      return acc;
    }, {});

    return Object.values(obj);
  }, [bundleComponents]);

  return (
    <Card>
      <BlockStack gap="300">
        <BlockStack>
          <InlineStack wrap={false} align="space-between">
            <InlineStack wrap={false} gap="300">
              <Text as="h2" variant="headingMd">
                {title}
              </Text>
              <Badge tone={tones[status] as Tone}>{status}</Badge>
            </InlineStack>
            <ButtonGroup>
              <Button
                variant="monochromePlain"
                onClick={() => navigate(`bundles/${id}`)}
              >
                Edit
              </Button>
            </ButtonGroup>
          </InlineStack>
          <Text tone="subdued" as="span" variant="bodySm">
            {price} {shop?.currency}
          </Text>
        </BlockStack>
        <Box>
          <Text as="p">{description}</Text>
        </Box>
        <Collapsible id={`bundleCard-collapsible-${id}`} open={open}>
          <BlockStack gap="300">
            {products.map(({ title, image, variants }, index) => (
              <Card key={index}>
                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <InlineStack blockAlign="center" gap="400">
                      <Thumbnail
                        source={image || ImageIcon}
                        alt="product image"
                      />
                      <BlockStack>
                        <Text as="h2">{title}</Text>
                        {variants.length === 1 && (
                          <Text as="span" tone="subdued" variant="bodySm">
                            {variants[0].price
                              ? parseFloat(variants[0].price)
                                ? `${variants[0].price} ${shop?.currency}`
                                : "Free"
                              : ""}
                          </Text>
                        )}
                      </BlockStack>
                    </InlineStack>
                    {variants.length === 1 && (
                      <BlockStack inlineAlign="end" align="center" gap="200">
                        <Text as="h4">Quantity</Text>
                        <Text as="span">{variants[0].quantity}</Text>
                      </BlockStack>
                    )}
                  </InlineStack>
                  {variants?.length > 1 && (
                    <BlockStack gap="300">
                      <InlineStack align="space-between">
                        <Text as="h4" variant="headingSm">
                          Variants
                        </Text>
                        <Text as="h4">Quantity</Text>
                      </InlineStack>
                      {variants.map(({ title, quantity, price }, index) => (
                        <BlockStack key={index} gap="300">
                          <InlineStack
                            align="space-between"
                            blockAlign="center"
                          >
                            <BlockStack>
                              <Text as="span">{title}</Text>
                              <Text as="span" tone="subdued" variant="bodySm">
                                {price
                                  ? parseFloat(price)
                                    ? `${price} ${shop?.currency}`
                                    : "Free"
                                  : ""}
                              </Text>
                            </BlockStack>
                            <Text as="span">{quantity}</Text>
                          </InlineStack>
                          {variants.length - 1 !== index && <Divider />}
                        </BlockStack>
                      ))}
                    </BlockStack>
                  )}
                </BlockStack>
              </Card>
            ))}
          </BlockStack>
        </Collapsible>
        <InlineStack align="center" blockAlign="center" gap="200">
          {bundleComponentCount && (
            <ButtonGroup>
              <Button
                variant="monochromePlain"
                icon={open ? ChevronUpIcon : ChevronDownIcon}
                onClick={() => setOpen(!open)}
              >
                {open ? "Less" : "More"}
              </Button>
            </ButtonGroup>
          )}
        </InlineStack>
      </BlockStack>
    </Card>
  );
};
