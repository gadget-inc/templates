import { useAction, useActionForm } from "@gadgetinc/react";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { api } from "../api";
import PageTemplate from "./PageTemplate";
import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Form,
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

const SkeletonForm = () => {
  return (
    <Card>
      <SkeletonPage primaryAction>
        <Form>
          <FormLayout>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
            <FormLayout.Group>
              <BlockStack gap={300}>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={1} />
              </BlockStack>
              <BlockStack gap={300}>
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
        </Form>
      </SkeletonPage>
    </Card>
  );
};

export default () => {
  const navigate = useNavigate();
  const { bundleId } = useParams();

  const {
    control,
    submit,
    formState: {
      errors,
      isDirty,
      isValid,
      isSubmitting,
      isValidating,
      isLoading,
      defaultValues,
    },
    watch,
    getValues,
  } = useActionForm(api.bundle.update, {
    findBy: bundleId,
    mode: "onBlur",
    select: {
      id: true,
      title: true,
      status: true,
      description: true,
      price: true,
      shopId: true,
      requiresComponents: true,
      bundleComponents: {
        edges: {
          node: {
            id: true,
            quantity: true,
            productVariant: {
              id: true,
              title: true,
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
    onError: (error) => console.error(error),
  });

  const [{ data: deletedBundle }, deleteBundle] = useAction(api.bundle.delete);

  const updateBundle = useCallback(async () => {
    const { data, error } = await submit();

    if (data) {
      navigate("/");
    } else {
      console.error("Error submitting form", error);
    }
  }, [submit]);

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
        isSubmitting || !isDirty || !isValid || isLoading || isValidating
      }
    >
      <Layout sectioned>
        <Layout.Section>
          {isLoading ? (
            <SkeletonForm />
          ) : (
            <Card>
              <BlockStack gap="500">
                <InlineStack wrap={false} align="space-between">
                  <Text as="h2" variant="headingLg">
                    {defaultValues?.title || ""}
                  </Text>
                  <ButtonGroup>
                    <Button
                      variant="plain"
                      tone="critical"
                      onClick={() => deleteBundle({ id: bundleId })}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </InlineStack>
                <BundleForm
                  {...{
                    control,
                    errors,
                    watch,
                    getValues,
                  }}
                  updateForm
                />
              </BlockStack>
            </Card>
          )}
        </Layout.Section>
      </Layout>
    </PageTemplate>
  );
};
