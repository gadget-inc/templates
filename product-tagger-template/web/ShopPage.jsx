import { useCallback, useState } from "react";
import {
  useFindMany,
  useAction,
  useActionForm,
  Controller,
} from "@gadgetinc/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Banner,
  Button,
  Form,
  FormLayout,
  Layout,
  Page,
  Spinner,
  Tag,
  TextField,
  Card,
  BlockStack,
  Text,
  InlineStack,
} from "@shopify/polaris";
import { api } from "./api";

// component used to display error messages
const ErrorBanner = ({ title, error }) => {
  return (
    <Banner tone="critical" title={title}>
      <code>{error.toString()}</code>
    </Banner>
  );
};

const ShopPage = () => {
  // state used to disable the tag being deleted
  const [deletedTagId, setDeletedTagId] = useState(false);

  // a useFindMany hook to fetch allowedTag data
  const [{ data, fetching, error }] = useFindMany(api.allowedTag);

  // useActionForm used to manage form state and submission for creating new tags
  const {
    submit,
    control,
    reset,
    error: createError,
    formState,
  } = useActionForm(api.allowedTag.create);
  // the useAction hook is used for deleting existing tags
  const [{ error: deleteTagError }, deleteTag] = useAction(
    api.allowedTag.delete
  );

  const removeTag = useCallback(
    async (id) => {
      // set the id of the deleted tag for disabling in UI
      setDeletedTagId(id);
      // call the deleteTag function defined with the useAction hook with the id of the tag to delete
      await deleteTag({ id });
    },
    [deleteTag]
  );

  // render the page, using data, fetching, and error from the useFindMany, useAction, and useActionForm hooks to display different widgets
  return (
    <Page title="Keyword manager">
      <Layout>
        <Layout.Section>
          <TitleBar title="Manage keywords" />
          <Form
            onSubmit={async () => {
              // submit the form and save the keyword as a new allowedTag record
              await submit();
              // reset the form input to empty
              reset();
            }}
          >
            <FormLayout>
              {createError && (
                <ErrorBanner title="Error adding keyword" error={createError} />
              )}
              <Controller
                name="keyword"
                control={control}
                required
                render={({ field }) => {
                  // Functional components like the Polaris TextField do not allow for 'ref's to be passed in
                  // Remove it from the props passed to the TextField
                  const { ref, ...fieldProps } = field;
                  // Pass the field props down to the TextField to set the value value and add onChange handlers
                  return (
                    <TextField
                      label="Tag"
                      type="text"
                      autoComplete="tag"
                      helpText={<span>Add a keyword</span>}
                      disabled={formState.isSubmitting}
                      connectedRight={
                        <Button
                          variant="primary"
                          submit
                          loading={formState.isSubmitting}
                        >
                          Add keyword
                        </Button>
                      }
                      autoComplete="off"
                      {...fieldProps}
                    />
                  );
                }}
              ></Controller>
            </FormLayout>
          </Form>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text variant="headingSm" as="h5">
                Existing keywords
              </Text>
              {fetching && <Spinner />}
              {error && (
                <ErrorBanner title="Error reading tags" error={error} />
              )}
              {deleteTagError && (
                <ErrorBanner
                  title="Error removing keyword"
                  error={deleteTagError}
                />
              )}
              <InlineStack gap="100">
                {data?.map((allowedTag, i) => (
                  <Tag
                    key={i}
                    onRemove={allowedTag.id === deletedTagId ? null : () => removeTag(allowedTag.id)}
                    disabled={allowedTag.id === deletedTagId}
                  >
                    {allowedTag.keyword}
                  </Tag>
                ))}
              </InlineStack>
              {data?.length === 0 && <p>No keywords added</p>}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopPage;
