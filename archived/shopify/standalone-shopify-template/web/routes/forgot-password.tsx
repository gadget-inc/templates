import { Controller, useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import {
  BlockStack,
  Button,
  Card,
  Form,
  FormLayout,
  Text,
  TextField,
} from "@shopify/polaris";
import { useEffect } from "react";

export default function () {
  const {
    submit,
    control,
    formState: { isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.sendResetPassword);

  return isSubmitSuccessful ? (
    <Text as="p">Email has been sent. Please check your inbox.</Text>
  ) : (
    <Card>
      <Form onSubmit={submit}>
        <FormLayout>
          <BlockStack gap="300">
            <Text as="h1">Reset password</Text>
            <Controller
              name="email"
              control={control}
              render={({ field: { ref, ...fieldProps } }) => (
                <TextField
                  label="Email"
                  autoComplete="email"
                  placeholder="Email"
                  {...fieldProps}
                  value={fieldProps.value ?? ""}
                />
              )}
            />
            <Button disabled={isSubmitting} submit>
              Send reset link
            </Button>
          </BlockStack>
        </FormLayout>
      </Form>
    </Card>
  );
}
