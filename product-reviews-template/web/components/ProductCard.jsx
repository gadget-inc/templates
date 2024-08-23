import {
  AutoForm,
  AutoSubmit,
  AutoTextInput,
} from "@gadgetinc/react/auto/polaris";
import {
  Button,
  ButtonGroup,
  Card,
  Collapsible,
  InlineStack,
  Text,
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import { api } from "../api";
import { useState } from "react";
import Stars from "./Stars";

export default ({ id, title, orderId }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <Text as="h2" variant="headingMd">
        {title}
      </Text>
      <Collapsible open={open}>
        <AutoForm
          action={api.review.create}
          title=""
          defaultValues={{
            orderId,
            productId: id,
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
    </Card>
  );
};
