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
    <Text as="p" className="format-message success">
      Password changed successfully.{" "}
      <Link to="/signed-in">Back to profile</Link>
    </Text>
  ) : (
    <Card>
      <Form className="custom-form" onSubmit={submit}>
        <FormLayout>
          <BlockStack gap={300}>
            <Text as="h1">Change password</Text>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field: { ref, ...fieldProps } }) => (
                <TextField
                  placeholder="Current password"
                  type="password"
                  {...fieldProps}
                />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              render={({ field: { ref, ...fieldProps } }) => (
                <TextField
                  placeholder="New password"
                  type="password"
                  {...fieldProps}
                  error={errors?.user?.newPassword?.message}
                />
              )}
            />
            {errors?.root?.message && (
              <Text as="p" className="format-message error">
                {errors.root.message}
              </Text>
            )}
            <Link to="/signed-in">Back to profile</Link>
            <Button disabled={isSubmitting} type="submit" onClick={submit}>
              Change password
            </Button>
          </BlockStack>
        </FormLayout>
      </Form>
    </Card>
  );
}
