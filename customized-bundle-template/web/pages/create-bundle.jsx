import { useCallback, useContext } from "react";
import { api } from "../api";
import { useActionForm } from "@gadgetinc/react";
import { Card, Text, Layout, BlockStack } from "@shopify/polaris";
import { BundleForm, PageTemplate } from "../components";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../providers";

export default () => {
  const { shop } = useContext(ShopContext);
  const navigate = useNavigate();

  const {
    control,
    submit,
    setValue,
    formState: { errors, isDirty, isValid, isSubmitting },
    getValues,
    watch,
  } = useActionForm(api.bundle.create, {
    mode: "onBlur",
    defaultValues: {
      bundle: {
        title: "",
        description: "",
        status: "active",
        shopId: shop.id,
        price: 0,
        bundleComponents: [],
      },
    },
    onError: (error) => console.log(error),
  });

  const createBundle = useCallback(async () => {
    const result = await submit();

    if (!result) {
      return;
    }

    const { data, error } = result;

    if (data) {
      navigate("/");
    } else {
      console.error("Error submitting form", error);
    }
  }, []);

  return (
    <PageTemplate
      inForm
      submit={createBundle}
      saveDisabled={isSubmitting || !isDirty || !isValid}
    >
      <Layout sectioned>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text as="h2" variant="headingLg">
                Create a bundle
              </Text>
              <BundleForm
                {...{
                  control,
                  errors,
                  getValues,
                  watch,
                  setValue,
                }}
              />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </PageTemplate>
  );
};
