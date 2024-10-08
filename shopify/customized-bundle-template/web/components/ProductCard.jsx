import { Controller } from "@gadgetinc/react";
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

export default ({
  title,
  images,
  variants,
  control,
  name,
  bundleComponents,
  errors,
  currency,
}) => {
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
            <Thumbnail source={images[0]?.originalSrc || ImageIcon} />
            <BlockStack>
              <Text>
                {variants.length === 1 && variants[0].displayName
                  ? variants[0].displayName
                  : title}
              </Text>
              {variants.length === 1 && (
                <Text as="span" tone="subdued" variant="bodySm">
                  {parseFloat(variants[0].price)
                    ? `${variants[0].price} ${currency}`
                    : "Free"}
                </Text>
              )}
            </BlockStack>
          </InlineStack>
          {variants.length == 1 && (
            <BlockStack inlineAlign="end" align="center" gap={200}>
              <Text>Quantity</Text>
              <Controller
                control={control}
                name={`${name}.${productVariantIds.indexOf(variants[0].id.replace(/gid:\/\/shopify\/ProductVariant\//g, ""))}.quantity`}
                render={({ field: { ref, ...fieldProps } }) => (
                  <TextField
                    {...fieldProps}
                    type="number"
                    autoComplete="off"
                    onChange={(value) => fieldProps.onChange(parseInt(value))}
                    value={fieldProps.value?.toString() || ""}
                    error={
                      errors?.bundle?.bundleComponents &&
                      errors?.bundle?.bundleComponents[
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
              <Text>Quantity</Text>
            </InlineStack>
            {variants.map(
              ({ title: variantTitle, id: variantId, price }, index) => {
                const bcIndex = productVariantIds.indexOf(
                  variantId.replace(/gid:\/\/shopify\/ProductVariant\//g, "")
                );
                return (
                  <BlockStack key={index} gap={300}>
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack>
                        <Text>{variantTitle}</Text>
                        <Text as="span" tone="subdued" variant="bodySm">
                          {parseFloat(price) ? `${price} ${currency}` : "Free"}
                        </Text>
                      </BlockStack>
                      <Controller
                        control={control}
                        name={`${name}.${bcIndex}.quantity`}
                        render={({ field: { ref, ...fieldProps } }) => (
                          <TextField
                            {...fieldProps}
                            type="number"
                            autoComplete="off"
                            onChange={(value) => {
                              fieldProps.onChange(parseInt(value));
                            }}
                            error={
                              errors?.bundle?.bundleComponents &&
                              errors?.bundle?.bundleComponents[bcIndex]
                                ?.quantity?.message
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
