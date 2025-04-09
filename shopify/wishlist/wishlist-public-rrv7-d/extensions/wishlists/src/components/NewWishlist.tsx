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
import { GadgetRecordList } from "@gadget-client/wishlist-public-rrv7-d";

export default ({
  wishlists,
}: {
  wishlists:
    | GadgetRecordList<{
        id: string;
        name: string;
        image: {
          url: string;
        } | null;
        itemCount: any;
      }>
    | undefined;
}) => {
  const { shop } = useContext(ShopContext);
  const { ui } = useApi();

  const {
    control,
    submit,
    formState: { isDirty, isValid, isSubmitting, errors },
  } = useActionForm(api.wishlist.create, {
    defaultValues: {
      wishlist: {
        name: "",
        customerId: shop?.customers?.edges[0]?.node.id,
      },
    },
    mode: "onChange",
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
                {...fieldProps}
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

                if (!passed) return "Name must be unique";

                return true;
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
