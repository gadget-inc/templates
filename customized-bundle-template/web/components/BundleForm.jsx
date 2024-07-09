import { Controller, useFieldArray } from "@gadgetinc/react";
import {
  BlockStack,
  Button,
  Form,
  FormLayout,
  TextField,
  Select,
  Checkbox,
  Text,
  ButtonGroup,
  InlineStack,
  InlineError,
} from "@shopify/polaris";
import { useCallback, useContext, useEffect, useState } from "react";
import { ShopContext } from "../providers";
import { useAppBridge } from "@shopify/app-bridge-react";
import ProductCard from "./ProductCard";

export default ({ control, errors, updateForm }) => {
  const [selectedProducts, setSelectedProducts] = useState([]),
    [loading, setLoading] = useState(true),
    [bundleComponentsQuantityError, setBundleComponentsQuantityError] =
      useState(false);
  const { shop } = useContext(ShopContext);
  const shopify = useAppBridge();

  const {
    fields: bundleComponents,
    append: appendBundleComponent,
    remove: removeBundleComponent,
  } = useFieldArray({
    control,
    name: "bundle.bundleComponents",
    rules: {
      validate: (value) => {
        let quantity = 0;

        for (const bc of value) {
          quantity += bc?.quantity || 0;
          if (quantity > 1) return setBundleComponentsQuantityError(false);
        }

        setBundleComponentsQuantityError(true);
      },
    },
  });

  const handleSelection = useCallback(
    (selection) => {
      if (!selection) return;

      setSelectedProducts(selection);

      if (selection) {
        const variants = selection
          .reduce((variantsTemp, product) => {
            return variantsTemp.concat(product.variants);
          }, [])
          .map((variant) => ({
            id: variant?.id.replace(/gid:\/\/shopify\/ProductVariant\//g, ""),
          }));

        const tempBC = bundleComponents.map((bc) => bc.id);

        for (const bundleComponent of bundleComponents) {
          if (
            !variants.some(
              (v) =>
                v.id === bundleComponent.productVariant?.id ||
                v.id === bundleComponent.productVariantId
            )
          ) {
            const index = tempBC.indexOf(bundleComponent.id);

            removeBundleComponent(index);
            tempBC.splice(index, 1);
          }
        }

        for (const variant of variants) {
          if (
            !bundleComponents.some(
              (bc) =>
                bc?.productVariant?.id === variant.id ||
                bc?.productVariantId === variant.id
            )
          ) {
            appendBundleComponent({
              shopId: shop.id,
              productVariantId: variant.id,
              quantity: 1,
            });
          }
        }
      }
    },
    [shop, bundleComponents]
  );

  useEffect(() => {
    if (bundleComponents?.length && updateForm && loading) {
      const tempObj = {};

      for (const bundleComponent of bundleComponents) {
        if (!tempObj[bundleComponent?.productVariant?.product?.id]) {
          tempObj[bundleComponent.productVariant.product.id] = {
            id: `gid://shopify/Product/${bundleComponent.productVariant.product.id}`,
            title: bundleComponent.productVariant.product.title,
            variants: [
              {
                id: `gid://shopify/ProductVariant/${bundleComponent.productVariant.id}`,
                title: bundleComponent.productVariant.title,
              },
            ],
            images: [
              {
                id: `gid://shopify/ProductImage/${bundleComponent?.productVariant?.product?.images[0]?.id}`,
                originalSrc:
                  bundleComponent?.productVariant?.product?.images[0]?.source,
              },
            ],
          };
        } else {
          tempObj[bundleComponent.productVariant.product.id].variants.push({
            id: `gid://shopify/ProductVariant/${bundleComponent.productVariant.id}`,
            title: bundleComponent.productVariant.title,
          });
        }
      }

      setSelectedProducts(Object.values(tempObj));
      setLoading(false);
    }
  }, [bundleComponents]);

  return (
    <Form>
      <FormLayout>
        <Controller
          name="bundle.title"
          control={control}
          required
          render={({ field: { ref, ...fieldProps } }) => (
            <TextField
              label="Name"
              type="text"
              autoComplete="off"
              {...fieldProps}
              error={errors?.bundle?.title?.message} // Check this out
            />
          )}
          rules={{
            required: "A title must be provided.",
          }}
        />
        <FormLayout.Group>
          <Controller
            name="bundle.price"
            control={control}
            render={({ field: { ref, ...fieldProps } }) => (
              <TextField
                label="Price"
                type="number"
                autoComplete="off"
                {...fieldProps}
                value={fieldProps?.value?.toString() || ""}
                onChange={(value) => {
                  fieldProps.onChange(parseFloat(value));
                }}
                error={errors?.bundle?.price?.message}
              />
            )}
            rules={{
              validate: {
                positive: (value) =>
                  parseFloat(value) > 0 || "Price must be greater than 0.",
              },
            }}
          />
          <Controller
            name="bundle.status"
            control={control}
            required
            render={({ field: { ref, ...fieldProps } }) => (
              <Select
                label="Status"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Draft", value: "draft" },
                  { label: "Archived", value: "archived" },
                ]}
                {...fieldProps}
              />
            )}
          />
        </FormLayout.Group>
        <Controller
          name="bundle.requiresComponents"
          control={control}
          render={({ field: { ref, ...fieldProps } }) => (
            <Checkbox
              {...fieldProps}
              checked={fieldProps.value}
              label="Requires that all variants be part of the cart to bundle"
            />
          )}
        />
        <Controller
          name="bundle.description"
          control={control}
          required
          render={({ field: { ref, ...fieldProps } }) => (
            <TextField
              label="Description"
              maxHeight={300}
              type="text"
              autoComplete="off"
              multiline={4}
              {...fieldProps}
              error={errors?.bundle?.description?.message}
            />
          )}
          rules={{
            validate: (value) =>
              value.length >= 200 ||
              "The description must have a minimum of 200 characters.",
          }}
        />
        <InlineStack align="space-between" blockAlign="center">
          <Text as="h3" variant="headingSm">
            Products
          </Text>
          <ButtonGroup>
            <Button
              onClick={async () => {
                const selection = await shopify.resourcePicker({
                  type: "product",
                  multiple: true,
                  selectionIds: selectedProducts,
                  action: "select",
                });

                handleSelection(selection);
              }}
              variant="primary"
            >
              Select products
            </Button>
          </ButtonGroup>
        </InlineStack>
        {selectedProducts?.length ? (
          <>
            <BlockStack gap="300">
              {selectedProducts?.map(({ id, title, images, variants }) => (
                <ProductCard
                  {...{
                    title,
                    images,
                    variants,
                    bundleComponents,
                    control,
                    name: "bundle.bundleComponents",
                    errors,
                  }}
                  key={id}
                />
              ))}
              {bundleComponentsQuantityError && (
                <InlineError
                  message={"There must be at least 2 items in a bundle."}
                />
              )}
            </BlockStack>
          </>
        ) : (
          <BlockStack align="center" inlineAlign="center">
            <Text as="span">No products selected</Text>
          </BlockStack>
        )}
      </FormLayout>
    </Form>
  );
};
