import {
  AutoForm,
  AutoSubmit,
  AutoStringInput,
} from "@gadgetinc/react/auto/polaris";
import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Collapsible,
  Icon,
  InlineStack,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ImageIcon,
  CheckCircleIcon,
} from "@shopify/polaris-icons";
import { api } from "../api";
import { useState } from "react";
import Stars from "./Stars";

export default ({
  id: productId,
  title,
  orderId,
  lineItemId,
  image,
  alt,
  reviewCreated,
}: {
  id: string;
  title: string;
  orderId: string;
  lineItemId: string;
  reviewCreated: boolean;
  image: string;
  alt: string;
}) => {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack blockAlign="center" gap="400">
            <Thumbnail
              source={image || ImageIcon}
              alt={alt || "Image placeholder"}
            />
            <Text as="h2" variant="headingMd">
              {title}
            </Text>
          </InlineStack>
          {(completed || reviewCreated) && (
            <InlineStack align="center" blockAlign="center" gap="200">
              <Icon source={CheckCircleIcon} />
              <Text as="h3" variant="headingSm">
                Review completed!
              </Text>
            </InlineStack>
          )}
        </InlineStack>
        <Collapsible open={open} id={`collapsible-${productId}`}>
          <AutoForm
            action={api.review.create}
            defaultValues={{
              review: {
                orderId,
                productId,
                lineItemId,
                rating: 0
              },
            }}
            onSuccess={() => {
              setOpen(false);
              setCompleted(true);
            }}
          >
            <Stars />
            <AutoStringInput field="content" multiline={4} maxHeight={90} />
            <InlineStack>
              <ButtonGroup>
                <AutoSubmit variant="primary" />
              </ButtonGroup>
            </InlineStack>
          </AutoForm>
        </Collapsible>
        {!completed && !reviewCreated && (
          <InlineStack align="center" blockAlign="center" gap="200">
            <ButtonGroup>
              <Button
                variant="monochromePlain"
                icon={open ? ChevronUpIcon : ChevronDownIcon}
                onClick={() => setOpen(!open)}
              >
                {open ? "Close" : "Write a review"}
              </Button>
            </ButtonGroup>
          </InlineStack>
        )}
      </BlockStack>
    </Card>
  );
};
