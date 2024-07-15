import { Controller, useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { useLocation } from "react-router-dom";
import {
  BlockStack,
  Button,
  Card,
  Form,
  FormLayout,
  InlineStack,
  Text,
  TextField,
} from "@shopify/polaris";

export default function () {
  const {
    submit,
    control,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.signUp);
  const { search } = useLocation();

  return (
    <Card padding={400}>
      <Form className="custom-form" onSubmit={submit}>
        <BlockStack gap={300}>
          <Text as="h1" variant="headingLg">
            Create account
          </Text>
          <FormLayout className="custom-form">
            <Button
              className="google-oauth-button"
              url={`/auth/google/start${search}`}
            >
              <InlineStack blockAlign="center" gap={300}>
                <img
                  src="https://assets.gadget.dev/assets/default-app-assets/google.svg"
                  width={22}
                  height={22}
                />
                <Text as="span">Continue with Google</Text>
              </InlineStack>
            </Button>
            <Controller
              name="email"
              control={control}
              render={({ field: { ref, fieldProps } }) => (
                <TextField
                  label="Email"
                  placeholder="Email"
                  {...fieldProps}
                  error={errors?.user?.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field: { ref, fieldProps } }) => (
                <TextField
                  label="Password"
                  placeholder="Password"
                  {...fieldProps}
                  error={errors?.user?.password?.message}
                />
              )}
            />
            {errors?.root?.message && (
              <Text as="p" className="format-message error">
                {errors.root.message}
              </Text>
            )}
            {isSubmitSuccessful && (
              <Text as="p" className="format-message success">
                Please check your inbox
              </Text>
            )}
            <Button disabled={isSubmitting} type="submit">
              Sign up
            </Button>
          </FormLayout>
        </BlockStack>
      </Form>
    </Card>
  );
}
