import { AutoForm } from "@gadgetinc/react/auto/polaris";
import { Button, Card, Text } from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import { api } from "../api";
import { useState } from "react";

export default ({ id, title, orderId }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <AutoForm
        action={api.review.create}
        defaultValues={{
          orderId,
          productId: id,
        }}
      >
        <Text as="h2" variant="headingMd">
          {title}
        </Text>
        <Button
          variant="monochromePlain"
          icon={open ? ChevronUpIcon : ChevronDownIcon}
        >
          {open ? "Close" : "Write a review"}
        </Button>
      </AutoForm>
    </Card>
  );
};
