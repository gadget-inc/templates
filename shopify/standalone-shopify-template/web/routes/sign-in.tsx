import { Controller, useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { Link, useLocation } from "react-router-dom";
import {
  BlockStack,
  Button,
  Card,
  Divider,
  Form,
  FormLayout,
  Text,
  TextField,
} from "@shopify/polaris";
import GoogleIcon from "../icons/GoogleIcon";

export default function () {
  const {
    submit,
    control,
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.signIn);
  const { search } = useLocation();

  return (
    <Card>
      <Form onSubmit={submit}>
        <BlockStack gap="300">
          <Text as="h1" variant="headingLg">
            Sign In
          </Text>
          <FormLayout>
            <Controller
              name="email"
              control={control}
              render={({ field: { ref, ...fieldProps } }) => (
                <TextField
                  label="Email"
                  placeholder="Email"
                  {...fieldProps}
                  error={errors?.user?.email?.message}
                  autoComplete="off"
                  value={fieldProps.value ?? ""}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field: { ref, ...fieldProps } }) => (
                <TextField
                  label="Password"
                  placeholder="Password"
                  type="password"
                  {...fieldProps}
                  error={errors?.user?.password?.message}
                  autoComplete="off"
                  value={fieldProps.value ?? ""}
                />
              )}
            />
            <Button disabled={isSubmitting} submit>
              Sign in
            </Button>
            <Divider />
            <Button url={`/auth/google/start${search}`} icon={GoogleIcon}>
              Continue with Google
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
