import { FormProvider, useAction, useActionForm } from "@gadgetinc/react";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { api } from "../api";
import PageTemplate from "./PageTemplate";
import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  FormLayout,
  InlineStack,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  SkeletonTabs,
  SkeletonThumbnail,
  Text,
} from "@shopify/polaris";
import BundleForm from "./BundleForm";

// A skeleton version of the bundle update card to display while the bundle is loading
const SkeletonForm = () => {
  return (
    <Card>
      <SkeletonPage primaryAction>
        <Card>
          <FormLayout>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
            <FormLayout.Group>
              <BlockStack gap="300">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={1} />
              </BlockStack>
              <BlockStack gap="300">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={1} />
              </BlockStack>
            </FormLayout.Group>
            <SkeletonBodyText lines={1} />
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={4} />
            <SkeletonDisplayText />
            <BlockStack gap="300">
              <Card>
                <BlockStack gap="300">
                  <SkeletonThumbnail />
                  <BlockStack gap="300">
                    <SkeletonDisplayText size="small" />
                    <SkeletonTabs count={2} />
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </FormLayout>
        </Card>
      </SkeletonPage>
    </Card>
  );
};

export default () => {
  const navigate = useNavigate();
  const { bundleId } = useParams();

  const formContext = useActionForm(api.bundle.update, {
    findBy: bundleId,
    mode: "onBlur",
    select: {
      id: true,
      title: true,
      status: true,
      description: true,
      price: true,
      shopId: true,
      bundleComponents: {
        edges: {
          node: {
            id: true,
            quantity: true,
            productVariant: {
              id: true,
              title: true,
              price: true,
              product: {
                id: true,
                title: true,
                images: {
                  edges: {
                    node: {
                      id: true,
                      source: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const [{ data: deletedBundle }, deleteBundle] = useAction(api.bundle.delete);

  // A special handler for form submission that displays an error if the title already exists or redirects to the homepage
  const updateBundle = useCallback(async () => {
    const { data, error } = await formContext.submit();

    if (data) {
      navigate("/");
    } else {
      if (error?.message && /\btitle\b/.test(error.message))
        formContext.setError("bundle.title", {
          message: "A bundle with this title already exists",
          type: "submissionError",
        });
    }
  }, [formContext.submit]);

  // Redirects to the homepage if the bundle was successfully deleted
  useEffect(() => {
    if (deletedBundle) {
      navigate("/");
    }
  }, [deletedBundle]);

  return (
    <PageTemplate
      inForm
      submit={updateBundle}
      saveDisabled={
        formContext.formState.isSubmitting ||
        !formContext.formState.isDirty ||
        !formContext.formState.isValid ||
        formContext.formState.isLoading ||
        formContext.formState.isValidating ||
        // Disables the save button if there are no bundle components
        !formContext.getValues("bundle.bundleComponents")?.length
      }
    >
      <Layout sectioned>
        <Layout.Section>
          {formContext.formState.isLoading ? (
            <SkeletonForm />
          ) : (
            <Card>
              <BlockStack gap="500">
                <InlineStack wrap={false} align="space-between">
                  <Text as="h2" variant="headingLg">
                    {formContext.getValues("bundle.title") ?? ""}
                  </Text>
                  <ButtonGroup>
                    <Button
                      variant="plain"
                      tone="critical"
                      onClick={() => deleteBundle({ id: bundleId ?? "" })}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </InlineStack>
                <FormProvider {...formContext.originalFormMethods}>
                  <BundleForm updateForm />
                </FormProvider>
              </BlockStack>
            </Card>
          )}
        </Layout.Section>
      </Layout>
    </PageTemplate>
  );
};
