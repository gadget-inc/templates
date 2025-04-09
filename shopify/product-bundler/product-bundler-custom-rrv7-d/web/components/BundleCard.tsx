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
import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import type { Tone } from "@shopify/polaris/build/ts/src/components/Badge";
import type { JSONValue } from "@gadget-client/product-bundler-custom-rrv7-d";
import type { OutletContext } from "./App";

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
  status: "active" | "archived" | "draft";
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
            media: {
              edges: {
                node: {
                  image: JSONValue | null;
                };
              }[];
            };
          } | null;
        } | null;
      };
    }[];
  } | null;
  bundleComponentCount: JSONValue | null;
}) => {
  const { currency } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

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
      const { id, title, media } = productVariant?.product || {};

      if (id) {
        if (!acc[id]) {
          acc[id] = {
            id,
            title,
            image:
              (
                media?.edges[0]?.node?.image as {
                  id: string;
                  width: number;
                  height: number;
                  originalSrc: string;
                }
              )?.originalSrc ?? "",
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
                onClick={() => navigate(`bundle/${id}`)}
              >
                Edit
              </Button>
            </ButtonGroup>
          </InlineStack>
          <Text tone="subdued" as="span" variant="bodySm">
            {price} {currency}
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
                                ? `${variants[0].price} ${currency}`
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
                                    ? `${price} ${currency}`
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
          {!!bundleComponentCount && (
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
