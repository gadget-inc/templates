import { useActionForm, Controller } from "@gadgetinc/react";
import {
  Button,
  FooterHelp,
  Layout,
  Link,
  Page,
  TextField,
  Form,
  FormLayout,
  Card,
  BlockStack,
  InlineStack,
  Text,
} from "@shopify/polaris";
import { api } from "./api";
import { useState, useCallback } from "react";
import { ResourcePicker } from "@shopify/app-bridge-react";

const BundleForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]);

  const { control, submit, setValue } = useActionForm(api.bundle.create);

  const handleSelection = useCallback((selectPayload) => {
    setIsOpen(false);

    const { selection } = selectPayload;

    setSelectedVariants(selection);

    if (selection) {
      // Add support for changing quantity
      const variants = selection
        .reduce((variants, product) => {
          return variants.concat(product.variants);
        }, [])
        .map((variant) => ({ id: variant.id, quantity: 1 }));

      setValue("variants", variants);
    }
  }, []);

  console.log(selectedVariants);

  return (
    <Form onSubmit={submit}>
      <FormLayout>
        <Button submit variant="primary">
          Create
        </Button>
        <Controller
          name="title"
          control={control}
          required
          render={({ field }) => {
            const { ref, ...fieldProps } = field;
            return (
              <TextField
                label="Bundle name"
                type="text"
                autoComplete="off"
                {...fieldProps}
              />
            );
          }}
        />
        <Controller
          name="price"
          control={control}
          required
          render={({ field }) => {
            const { ref, ...fieldProps } = field;
            return (
              <TextField
                label="Bundle price"
                type="number"
                autoComplete="off"
                {...fieldProps}
              />
            );
          }}
        />
        <Card>
          <Button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            Product picker
          </Button>
          <BlockStack>
            {selectedVariants.map((variant, key) => (
              <Card key={key}>
                <InlineStack>
                  <Text>{variant.title}</Text>
                  <Text>{variant.quantity}</Text>
                </InlineStack>
              </Card>
            ))}
          </BlockStack>
        </Card>
        <ResourcePicker
          resourceType="Product"
          actionVerb="select"
          open={isOpen}
          onSelection={handleSelection}
          onCancel={() => setIsOpen(false)}
        />
      </FormLayout>
    </Form>
  );
};

const ShopPage = () => {
  return (
    <Page title="App">
      <Layout>
        <Layout.Section>
          <BundleForm />
        </Layout.Section>
        <Layout.Section>
          <FooterHelp>
            <p>
              Powered by{" "}
              <Link url="https://gadget.dev" external>
                gadget.dev
              </Link>
            </p>
          </FooterHelp>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopPage;
