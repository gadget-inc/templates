import { Controller, useFormContext } from "@gadgetinc/react";
import {
  BlockStack,
  Card,
  InlineStack,
  Thumbnail,
  Text,
  Divider,
  TextField,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
import { useMemo } from "react";
import { BundleComponent, Variant } from "./BundleForm";

export default ({
  title,
  images,
  variants,
  name,
  bundleComponents,
  currency,
}: {
  title: string;
  images: { id: string; originalSrc: string }[];
  variants: Variant[];
  name: string;
  bundleComponents: BundleComponent[];
  currency: string | undefined;
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Creates an array of product variant ids
  const productVariantIds = useMemo(
    () =>
      bundleComponents.map(
        (bc) => bc.productVariant?.id || bc.productVariantId
      ),
    [bundleComponents]
  );

  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between">
          <InlineStack blockAlign="center" gap="400">
            <Thumbnail
              source={images[0]?.originalSrc || ImageIcon}
              alt="product image"
            />
            <BlockStack>
              <Text as="h5">
                {variants.length === 1 && variants[0].displayName
                  ? variants[0].displayName
                  : title}
              </Text>
              {variants.length === 1 && (
                <Text as="span" tone="subdued" variant="bodySm">
                  {variants[0].price
                    ? parseFloat(variants[0].price)
                      ? `${variants[0].price} ${currency}`
                      : "Free"
                    : ""}
                </Text>
              )}
            </BlockStack>
          </InlineStack>
          {variants.length == 1 && (
            <BlockStack inlineAlign="end" align="center" gap="200">
              <Text as="h4">Quantity</Text>
              <Controller
                control={control}
                name={`${name}.${productVariantIds.indexOf(variants[0].id.replace(/gid:\/\/shopify\/ProductVariant\//g, ""))}.quantity`}
                render={({ field: { ref, ...fieldProps } }) => (
                  <TextField
                    {...fieldProps}
                    type="number"
                    label
                    autoComplete="off"
                    onChange={(value) => fieldProps.onChange(parseInt(value))}
                    value={fieldProps.value?.toString() || ""}
                    error={
                      (errors?.bundle as { bundleComponents?: [] })
                        ?.bundleComponents &&
                      (
                        errors?.bundle as unknown as {
                          bundleComponents: {
                            [key: string]: {
                              quantity?: { message?: string };
                            };
                          };
                        }
                      )?.bundleComponents[
                        productVariantIds.indexOf(
                          variants[0].id.replace(
                            /gid:\/\/shopify\/ProductVariant\//g,
                            ""
                          )
                        )
                      ]?.quantity?.message
                    }
                  />
                )}
                rules={{
                  validate: (value) => value > 0 || "Must be greater than 0.",
                }}
              />
            </BlockStack>
          )}
        </InlineStack>
        {variants?.length > 1 && (
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text as="h4" variant="headingSm">
                Variants
              </Text>
              <Text as="h4">Quantity</Text>
            </InlineStack>
            {variants.map(
              ({ title: variantTitle, id: variantId, price }, index) => {
                const bcIndex = productVariantIds.indexOf(
                  variantId.replace(/gid:\/\/shopify\/ProductVariant\//g, "")
                );
                return (
                  <BlockStack key={index} gap="300">
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack>
                        <Text as="h5">{variantTitle}</Text>
                        <Text as="span" tone="subdued" variant="bodySm">
                          {price
                            ? parseFloat(price)
                              ? `${price} ${currency}`
                              : "Free"
                            : ""}
                        </Text>
                      </BlockStack>
                      <Controller
                        control={control}
                        name={`${name}.${bcIndex}.quantity`}
                        render={({ field: { ref, ...fieldProps } }) => (
                          <TextField
                            {...fieldProps}
                            type="number"
                            label
                            autoComplete="off"
                            onChange={(value) => {
                              fieldProps.onChange(parseInt(value));
                            }}
                            error={
                              (errors?.bundle as { bundleComponents?: [] })
                                ?.bundleComponents &&
                              (
                                errors?.bundle as unknown as {
                                  bundleComponents: {
                                    [key: string]: {
                                      quantity?: { message?: string };
                                    };
                                  };
                                }
                              )?.bundleComponents[bcIndex]?.quantity?.message
                            }
                            value={fieldProps.value?.toString() || ""}
                          />
                        )}
                        rules={{
                          validate: (value) =>
                            value > 0 || "Must be greater than 0.",
                        }}
                      />
                    </InlineStack>
                    {variants.length - 1 !== index && <Divider />}
                  </BlockStack>
                );
              }
            )}
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
};
