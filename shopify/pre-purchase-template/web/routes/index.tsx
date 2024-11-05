import {
  useFindFirst,
  useFindMany,
  useActionForm,
  Controller,
} from "@gadgetinc/react";
import {
  Banner,
  FooterHelp,
  Layout,
  Link,
  Page,
  Select,
  Spinner,
  Form,
  Button,
  FormLayout,
  SkeletonDisplayText,
} from "@shopify/polaris";
import { api } from "../api";
import { useEffect, useState } from "react";

const PrePurchaseForm = ({
  products,
  shop,
}: {
  shop: { id: string };
  products: [{ id: string; label: string }];
}) => {
  // useActionForm used to handle form state and submission
  const { submit, control, formState, error, setValue, watch } = useActionForm(
    api.shopifyShop.savePrePurchaseProduct,
    {
      findBy: shop.id,
      select: {
        id: true,
        prePurchaseProduct: true,
      },
      // send productId as a custom param
      send: ["id", "productId"],
    }
  );

  // use watch to listen for updates to the form state
  const updateProductId = watch("shopifyShop.prePurchaseProduct");
  // save as productId value in form state to send custom param
  useEffect(() => {
    setValue("productId", updateProductId);
  }, [updateProductId]);

  return (
    <Form onSubmit={submit}>
      <FormLayout>
        {formState?.isSubmitSuccessful && (
          <Banner title="Pre-purchase product saved!" tone="success" />
        )}
        {error && (
          <Banner title="Error saving selection" tone="critical">
            {error.message}
          </Banner>
        )}
        {formState?.isLoading ? (
          <SkeletonDisplayText size="large" />
        ) : (
          <Controller
            name="shopifyShop.prePurchaseProduct"
            control={control}
            required
            render={({ field: { ref, ...fieldProps } }) => (
              <Select
                label="Product for pre-purchase offer"
                placeholder="-No product selected-"
                options={products}
                disabled={formState.isSubmitting}
                {...fieldProps}
              />
            )}
          />
        )}

        <Button submit disabled={formState.isSubmitting} variant="primary">
          Save
        </Button>
      </FormLayout>
    </Form>
  );
};

export default () => {
  // use React state to handle selected product and options
  const [productOptions, setProductOptions] = useState([]);

  // use the Gadget React hooks to fetch products as options for Select component
  const [
    { data: products, fetching: productsFetching, error: productsFetchError },
  ] = useFindMany(api.shopifyProduct);
  // get the current shop id (shop tenancy applied automatically, only one shop available)
  const [{ data: shopData, fetching: shopFetching, error: shopFetchError }] =
    useFindFirst(api.shopifyShop, {
      select: {
        id: true,
      },
    });

  // a React useEffect hook to build product options for the Select component
  useEffect(() => {
    if (products) {
      const options = products.map((product) => ({
        value: `gid://shopify/Product/${product.id}`,
        label: product.title,
      }));
      setProductOptions(options);
    }
  }, [products]);

  return (
    <Page title="Select product for pre-purchase offer">
      {productsFetching || shopFetching || productOptions.length === 0 ? (
        <Spinner size="large" />
      ) : (
        <Layout>
          {(productsFetchError || shopFetchError) && (
            <Layout.Section>
              <Banner title="Error loading data" tone="critical">
                {productsFetchError?.message || shopFetchError?.message}
              </Banner>
            </Layout.Section>
          )}
          <Layout.Section>
            <PrePurchaseForm shop={shopData} products={productOptions} />
          </Layout.Section>
          <Layout.Section>
            <FooterHelp>
              <p>
                Powered by <Link url="https://gadget.dev">gadget.dev</Link>
              </p>
            </FooterHelp>
          </Layout.Section>
        </Layout>
      )}
    </Page>
  );
};
