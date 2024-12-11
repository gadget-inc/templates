import { useUser, useActionForm, Controller } from "@gadgetinc/react";
import { api } from "../api";
import { Link } from "react-router-dom";
import {
  BlockStack,
  Button,
  Card,
  Form,
  FormLayout,
  Text,
  TextField,
} from "@shopify/polaris";

export default function () {
  const user = useUser(api);
  const {
    submit,
    control,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.changePassword, { defaultValues: user });

  return isSubmitSuccessful ? (
    <Text as="p">
      Password changed successfully.{" "}
      <Link to="/signed-in">Back to profile</Link>
    </Text>
  ) : (
    <Card>
      <Form onSubmit={submit}>
        <FormLayout>
          <BlockStack gap="300">
            <Text as="h1">Change password</Text>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field: { ref, ...fieldProps } }) => (
                <TextField
                  label="Current Password"
                  autoComplete="current-password"
                  placeholder="Current password"
                  type="password"
                  {...fieldProps}
                  value={fieldProps.value ?? ""}
                />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              render={({ field: { ref, ...fieldProps } }) => (
                <TextField
                  label="New Password"
                  autoComplete="new-password"
                  placeholder="New password"
                  type="password"
                  {...fieldProps}
                  value={fieldProps.value ?? ""}
                  error={errors?.user?.newPassword?.message}
                />
              )}
            />
            {errors?.root?.message && <Text as="p">{errors.root.message}</Text>}
            <Link to="/signed-in">Back to profile</Link>
            <Button disabled={isSubmitting} submit>
              Change password
            </Button>
          </BlockStack>
        </FormLayout>
      </Form>
    </Card>
  );
}
