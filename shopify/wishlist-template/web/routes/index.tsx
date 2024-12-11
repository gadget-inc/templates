import { Controller, useActionForm } from "@gadgetinc/react";
import {
  Layout,
  Page,
  Select,
  Button,
  Form,
  FormLayout,
  ButtonGroup,
  InlineStack,
  Text,
} from "@shopify/polaris";
import { api } from "../api";
import { useContext } from "react";
import { ShopContext } from "../providers";

export default function () {
  const { shop } = useContext(ShopContext);

  const {
    control,
    submit,
    formState: { isDirty },
  } = useActionForm(api.shopifyShop.update, {
    findBy: shop?.id,
    select: {
      id: true,
      defaultUpdateFrequency: true,
    },
  });

  return (
    <Page title="Wishlist template">
      <Layout>
        <Layout.Section>
          <Text as="p">
            The following is an example of updating the default update
            frequency. This is a field on the `shopifyShop` model.
          </Text>
          <Form onSubmit={submit}>
            <FormLayout>
              <Controller
                name="shopifyShop.defaultUpdateFrequency"
                control={control}
                render={({ field: { ref, ...fieldProps } }) => (
                  <Select
                    label="Customer wishlist email frequency"
                    options={[
                      { label: "Weekly", value: "weekly" },
                      { label: "Monthly", value: "monthly" },
                      { label: "Quarterly", value: "quarterly" },
                    ]}
                    {...fieldProps}
                    value={fieldProps.value ?? ""}
                  />
                )}
              />
              <InlineStack align="end">
                <ButtonGroup>
                  <Button submit variant="primary" disabled={!isDirty}>
                    Save
                  </Button>
                </ButtonGroup>
              </InlineStack>
            </FormLayout>
          </Form>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
