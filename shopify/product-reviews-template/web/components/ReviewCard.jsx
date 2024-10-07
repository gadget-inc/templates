import {
  AutoForm,
  AutoSubmit,
  AutoTextInput,
} from "@gadgetinc/react/auto/polaris";
import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Collapsible,
  InlineStack,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ImageIcon,
} from "@shopify/polaris-icons";
import { api } from "../api";
import { useState } from "react";
import Stars from "./Stars";

export default ({ id: productId, title, orderId, image }) => {
  const [open, setOpen] = useState(false);

  console.log({ productId, title, orderId, image });

  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack blockAlign="center" gap="400">
          <Thumbnail source={image || ImageIcon} />
          <Text as="h2" variant="headingMd">
            {title}
          </Text>
        </InlineStack>
        <Collapsible open={open}>
          <AutoForm
            action={api.review.create}
            title=""
            defaultValues={{
              review: {
                orderId,
                productId,
              },
            }}
            exclude={["anonymous", "approved", "customer", "order", "product"]}
            onSuccess={() => setOpen(false)}
          >
            <Stars />
            <AutoTextInput field="content" multiline={4} maxHeight={90} />
            <InlineStack>
              <ButtonGroup>
                <AutoSubmit />
              </ButtonGroup>
            </InlineStack>
          </AutoForm>
        </Collapsible>
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
      </BlockStack>
    </Card>
  );
};
