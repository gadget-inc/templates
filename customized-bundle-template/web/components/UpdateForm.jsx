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

// Default values for the bundleComponents needs to be fetched fro mthe API to make sure that we capture all the variants that could have been added to the bundle
// Make sure to keep an array that you will use as a lookup table so that I don't create/delete bundle components unnecessarily. Example, removing a bundle component from the list when changing the resource picker selection and adding it back in afterwards

// useFieldArray acts as a create/update/delete. When there's a value but no id the record is created, when there's a value with an id, the record is updated, when a record is removed from the array, the record is deleted.
