import {
  Badge,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  Collapsible,
  InlineStack,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import {
  ChevronUpMinor,
  ChevronDownMinor,
  ImageMajor,
} from "@shopify/polaris-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tones = {
  active: "success",
  archived: "complete",
  draft: "info",
};

// Add price to the bundle card
export default ({ id, title, description, status, price, productVariants }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Card>
      {/* Add a delete button to the card to delete the bundle */}
      <BlockStack gap="300">
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
        <Box paddingInline="500">
          <Text>{description}</Text>
        </Box>
        <Collapsible open={open}>
          <BlockStack gap="300">
            {productVariants.edges.map(
              ({ node: { title, product } }, index) => (
                <Card key={index}>
                  <InlineStack blockAlign="center" gap="400">
                    <Thumbnail
                      source={
                        product?.images?.edges[0]?.node?.source || ImageMajor
                      }
                    />
                    <Text>
                      {product.title}
                      {title && ` - ${title}`}
                    </Text>
                  </InlineStack>
                </Card>
              )
            )}
          </BlockStack>
        </Collapsible>
        <InlineStack align="center" blockAlign="center" gap="200">
          <ButtonGroup>
            <Button
              variant="monochromePlain"
              icon={open ? ChevronUpMinor : ChevronDownMinor}
              onClick={() => setOpen(!open)}
            >
              {open ? "Less" : "More"}
            </Button>
          </ButtonGroup>
        </InlineStack>
      </BlockStack>
    </Card>
  );
};
