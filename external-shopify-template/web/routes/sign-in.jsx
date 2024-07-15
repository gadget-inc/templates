import { Controller, useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { Link, useLocation } from "react-router-dom";
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
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.signIn);
  const { search } = useLocation();

  return (
    <Card padding={400}>
      <Form className="custom-form" onSubmit={submit}>
        <BlockStack gap={300}>
          <Text as="h1" variant="headingLg">
            Sign In
          </Text>
          <FormLayout>
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
            <Button disabled={isSubmitting} type="submit">
              Sign in
            </Button>
            {errors?.root?.message && <Text as="p">{errors.root.message}</Text>}
            <Text as="p" variant="bodySm">
              Forgot your password?{" "}
              <Link to="/forgot-password">Reset password</Link>
            </Text>
          </FormLayout>
        </BlockStack>
      </Form>
    </Card>
  );
}
