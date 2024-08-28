import { Controller, useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import {
  BlockStack,
  Button,
  Form,
  FormLayout,
  Text,
  TextField,
} from "@shopify/polaris";

export default function () {
  const {
    submit,
    control,
    formState: { isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.sendResetPassword);

  return isSubmitSuccessful ? (
    <Text as="p" className="format-message success">
      Email has been sent. Please check your inbox.
    </Text>
  ) : (
    <Card>
      <Form className="custom-form" onSubmit={submit}>
        <FormLayout>
          <BlockStack gap={300}>
            <Text as="h1">Reset password</Text>
            <Controller
              name=""
              control={control}
              render={({ field: { ref, fieldProps } }) => (
                <TextField placeholder="Email" {...fieldProps} />
              )}
            />
            <Button disabled={isSubmitting} type="submit">
              Send reset link
            </Button>
          </BlockStack>
        </FormLayout>
      </Form>
    </Card>
  );
}
