import { Controller, useFieldArray } from "@gadgetinc/react";
import {
  BlockStack,
  Button,
  Card,
  Form,
  FormLayout,
  InlineStack,
  Text,
  TextField,
  Select,
  Thumbnail,
  Badge,
  Checkbox,
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { useCallback, useContext, useEffect, useState } from "react";
import { ShopContext } from "../providers";
import { useAppBridge } from "@shopify/app-bridge-react";

export default ({ control, errors, getValues, isDirty, updateForm }) => {
  const [selectedProducts, setSelectedProducts] = useState([]),
    [loading, setLoading] = useState(true);
  const { shop } = useContext(ShopContext);
  const shopify = useAppBridge();

  const {
    fields: bundleComponents,
    append: appendBundleComponent,
    remove: removeBundleComponent,
  } = useFieldArray({
    control,
    name: "bundle.bundleComponents",
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

        for (const bundleComponent of bundleComponents) {
          if (!variants.some((v) => v.id === bundleComponent.productVariant.id))
            removeBundleComponent(bundleComponent.id);
        }

        for (const variant of variants) {
          if (
            !bundleComponents.some((bc) => bc?.productVariant.id === variant.id)
          )
            appendBundleComponent({
              shopId: shop.id,
              productVariantId: variant.id,
            });
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
          render={({ field }) => {
            const { ref, ...fieldProps } = field;
            return (
              <TextField
                label="Name"
                type="text"
                autoComplete="off"
                {...fieldProps}
              />
            );
          }}
        />
        <FormLayout.Group>
          <Controller
            name="bundle.price"
            control={control}
            required
            render={({ field }) => {
              const { ref, ...fieldProps } = field;
              return (
                <TextField
                  label="Price"
                  type="number"
                  autoComplete="off"
                  {...fieldProps}
                  value={fieldProps?.value?.toString() || ""}
                  onChange={(value) => {
                    fieldProps.onChange(parseFloat(value));
                  }}
                />
              );
            }}
          />
          <Controller
            name="bundle.status"
            control={control}
            required
            render={({ field }) => {
              const { ref, ...fieldProps } = field;
              return (
                <Select
                  label="Status"
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Draft", value: "draft" },
                    { label: "Archived", value: "archived" },
                  ]}
                  {...fieldProps}
                />
              );
            }}
          />
        </FormLayout.Group>
        <Controller
          name="bundle.requiresComponents"
          control={control}
          render={({ field }) => {
            const { ref, ...fieldProps } = field;
            return (
              <Checkbox
                {...fieldProps}
                checked={fieldProps.value}
                label="Requires that all variants be part of the cart to bundle"
              />
            );
          }}
        />
        <Controller
          name="bundle.description"
          control={control}
          required
          render={({ field }) => {
            const { ref, ...fieldProps } = field;
            return (
              <TextField
                label="Description"
                type="text"
                autoComplete="off"
                {...fieldProps}
              />
            );
          }}
        />
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
          Select variants
        </Button>
        <BlockStack gap="300">
          {selectedProducts?.map(({ id, title, images, variants }) => (
            <Card key={id}>
              <BlockStack gap="300">
                <InlineStack blockAlign="center" gap="400">
                  <Thumbnail source={images[0]?.originalSrc || ImageMajor} />
                  <Text>
                    {variants.length === 1 && variants[0].displayName
                      ? variants[0].displayName
                      : title}
                  </Text>
                </InlineStack>
                {variants?.length > 1 && (
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingMd">
                      Variants
                    </Text>
                    <InlineStack gap="300" blockAlign="center">
                      {variants.map(({ title }, index) => (
                        <Badge key={index}>{title}</Badge>
                      ))}
                    </InlineStack>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          ))}
        </BlockStack>
      </FormLayout>
    </Form>
  );
};
