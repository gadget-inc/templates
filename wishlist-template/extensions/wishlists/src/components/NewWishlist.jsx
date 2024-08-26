import { Controller, useActionForm } from "@gadgetinc/react";
import {
  Button,
  Modal,
  TextField,
  Form,
  InlineLayout,
  useApi,
} from "@shopify/ui-extensions-react/customer-account";
import { api } from "../api";
import { useCallback, useContext } from "react";
import { ShopContext } from "../providers";

export default ({ wishlists }) => {
  const { shop } = useContext(ShopContext);
  const { ui } = useApi();

  const {
    control,
    submit,
    formState: { isDirty, isValid, isSubmitting, isSubmitted, errors },
    setError,
  } = useActionForm(api.wishlist.create, {
    defaultValues: {
      wishlist: {
        name: "",
        shopId: shop?.id,
        customerId: shop?.customers?.edges[0]?.node.id,
      },
    },
    onError: (error) => console.error(error),
  });

  // Callback for handling form submission, closes the modal after submission
  const handleSubmit = useCallback(async () => {
    await submit();
    ui.overlay.close("new-wishlist");
  }, [submit]);

  return (
    <Modal title="New wishlist" id="new-wishlist" padding>
      <Form onSubmit={handleSubmit}>
        <InlineLayout
          blockAlignment="start"
          columns={["fill", "20%"]}
          spacing="loose"
        >
          <Controller
            name="wishlist.name"
            control={control}
            render={({ field: { ref, ...fieldProps } }) => (
              <TextField
                label="Name"
                onChange={(text) => fieldProps.onChange(text)}
                {...{ fieldProps }}
                maxLength={50}
                error={errors?.wishlist?.name?.message}
              />
            )}
            rules={{
              maxLength: {
                value: 50,
                message: "Name must be less than 50 characters",
              },
              required: "Name is required",
              validate: (value) => {
                const passed = !wishlists?.some(
                  (wishlist) => wishlist.name === value
                );

                if (!passed) {
                  setError("wishlist.name", {
                    type: "uniqueness",
                    message: "Name must be unique",
                  });
                  return "Name must be unique";
                }

                return setError("wishlist.name", null);
              },
            }}
          />
          <Button
            appearance="monochrome"
            accessibilityRole="submit"
            disabled={!isDirty || !isValid}
            loading={isSubmitting}
          >
            Create
          </Button>
        </InlineLayout>
      </Form>
    </Modal>
  );
};
