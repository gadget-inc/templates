import { useActionForm } from "@gadgetinc/react";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback } from "react";
import { api } from "../api";
import PageTemplate from "./PageTemplate";
import { BlockStack, Card, Layout, Text } from "@shopify/polaris";
import BundleForm from "./BundleForm";

export default () => {
  const navigate = useNavigate();
  const { bundleId } = useParams();

  const {
    control,
    submit,
    setValue,
    formState: { errors, isDirty, isValid, isSubmitting, isLoading },
    getValues,
    watch,
  } = useActionForm(api.bundle.update, {
    findBy: bundleId,
    mode: "onBlur",
    defaultValues: {
      id: bundleId,
    },
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
    onError: (error) => console.log(error),
  });

  const updateBundle = useCallback(async () => {
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
      submit={updateBundle}
      saveDisabled={isSubmitting || !isDirty || !isValid || isLoading}
    >
      <Layout sectioned>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text as="h2" variant="headingLg">
                {getValues("title")}
              </Text>
              <BundleForm
                {...{
                  control,
                  errors,
                  getValues,
                  watch,
                  setValue,
                  isDirty,
                }}
                updateForm
              />
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </PageTemplate>
  );
};
