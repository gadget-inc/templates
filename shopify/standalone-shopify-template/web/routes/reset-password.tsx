import { Controller, useActionForm, useAuth } from "@gadgetinc/react";
import { api } from "../api";
import { useLocation, Link } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  FormLayout,
  Text,
  TextField,
} from "@shopify/polaris";

export default function () {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const {
    submit,
    control,
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.resetPassword, {
    defaultValues: { code: params.get("code"), confirmPassword: "" },
  });
  const { configuration } = useAuth();

  return isSubmitSuccessful ? (
    <Text as="p" tone="success">
      Password reset successfully.{" "}
      <Link to={configuration.signInPath}>Sign in now</Link>
    </Text>
  ) : (
    <Card>
      <Form onSubmit={submit}>
        <FormLayout>
          <Text as="h1" variant="headingLg">
            Reset password
          </Text>
          <Controller
            name="password"
            control={control}
            render={({ field: { ref, ...fieldProps } }) => (
              <TextField
                label="New password"
                autoComplete="new-password"
                placeholder="New password"
                type="password"
                {...fieldProps}
                value={fieldProps.value ?? ""}
                error={errors?.user?.password?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { ref, ...fieldProps } }) => (
              <TextField
                label="Confirm password"
                autoComplete="new-password"
                placeholder="Confirm password"
                type="password"
                {...fieldProps}
                error={
                  (errors?.user as { confirmPassword?: { message: string } })
                    ?.confirmPassword?.message
                }
              />
            )}
            rules={{
              validate: (value) =>
                value === watch("password") || "The passwords do not match",
            }}
          />
          {errors?.root?.message && <Text as="p">{errors.root.message}</Text>}
          <Button disabled={isSubmitting} submit>
            Reset password
          </Button>
        </FormLayout>
      </Form>
    </Card>
  );
}
