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
  ChevronUpMinor,
  ChevronDownMinor,
  ImageMajor,
} from "@shopify/polaris-icons";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../providers";

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
}) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { shop } = useContext(ShopContext);

  const products = useMemo(() => {
    const tempObj = {};

    for (const {
      node: {
        quantity,
        productVariant: {
          id: variantId,
          title: variantTitle,
          product: { id, title, images },
        },
      },
    } of bundleComponents.edges) {
      if (!tempObj[id]) {
        tempObj[id] = {
          id,
          title,
          image: images.edges[0]?.node?.source,
          variants: [{ id: variantId, title: variantTitle, quantity }],
        };
      } else {
        tempObj[id].variants.push({
          id: variantId,
          title: variantTitle,
          quantity,
        });
      }
    }

    return Object.values(tempObj);
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
              <Badge tone={tones[status]}>{status}</Badge>
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
            Price: {price} {shop.currency}
          </Text>
        </BlockStack>
        <Box>
          <Text>{description}</Text>
        </Box>
        <Collapsible open={open}>
          <BlockStack gap="300">
            {products.map(({ title, image, variants }, index) => (
              <Card key={index}>
                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <InlineStack blockAlign="center" gap="400">
                      <Thumbnail source={image || ImageMajor} />
                      <Text>{title}</Text>
                    </InlineStack>
                    {variants.length === 1 && (
                      <BlockStack inlineAlign="end" align="center" gap={200}>
                        <Text>Quantity</Text>
                        <Text>{variants[0].quantity}</Text>
                      </BlockStack>
                    )}
                  </InlineStack>
                  {variants?.length > 1 && (
                    <BlockStack gap={300}>
                      <InlineStack align="space-between">
                        <Text as="h4" variant="headingSm">
                          Variants
                        </Text>
                        <Text>Quantity</Text>
                      </InlineStack>
                      {variants.map(({ title, quantity }, index) => (
                        <BlockStack key={index} gap={300}>
                          <InlineStack
                            align="space-between"
                            blockAlign="center"
                          >
                            <Text as="span">{title}</Text>
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
                icon={open ? ChevronUpMinor : ChevronDownMinor}
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
