import { useCallback, useContext } from "react";
import { api } from "../api";
import { FormProvider, useActionForm } from "@gadgetinc/react";
import { Card, Text, Layout, BlockStack } from "@shopify/polaris";
import { BundleForm, PageTemplate } from "../components";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../providers";
import type { ShopContextType } from "../providers/ShopProvider";

export default () => {
  const { shop }: { shop?: ShopContextType } = useContext(ShopContext);
  const navigate = useNavigate();

  const {
    submit,
    setError,
    formState: { isSubmitting, isDirty, isValid },
    originalFormMethods,
    getValues,
  } = useActionForm(api.bundle.create, {
    mode: "onBlur",
    defaultValues: {
      bundle: {
        title: "",
        description: "",
        status: "active",
        shopId: shop?.id,
        price: 0,
        bundleComponents: [],
      },
    },
  });

  // A special handler for form submission that displays an error if the title already exists or redirects to the homepage
  const createBundle = useCallback(async () => {
    const { data, error } = await submit();

    if (data) {
      navigate("/");
    } else {
      if (error?.message && /\btitle\b/.test(error.message))
        setError("bundle.title", {
          message: "A bundle with this title already exists",
          type: "submissionError",
        });
    }
  }, [submit]);

  return (
    <PageTemplate
      inForm
      submit={createBundle}
      saveDisabled={
        isSubmitting ||
        !isDirty ||
        !isValid ||
        // Disables the save button if there are no bundle components
        !getValues("bundle.bundleComponents").length
      }
    >
      <Layout sectioned>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text as="h2" variant="headingLg">
                Create a bundle
              </Text>
              <FormProvider {...originalFormMethods}>
                <BundleForm />
              </FormProvider>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </PageTemplate>
  );
};
