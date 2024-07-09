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
import { ImageMajor } from "@shopify/polaris-icons";

export default ({
  title,
  images,
  variants,
  control,
  name,
  bundleComponents,
}) => {
  const productVariantIds = bundleComponents.map(
    (bc) => bc.productVariant?.id || bc.productVariantId
  );

  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between">
          <InlineStack blockAlign="center" gap="400">
            <Thumbnail source={images[0]?.originalSrc || ImageMajor} />
            <Text>
              {variants.length === 1 && variants[0].displayName
                ? variants[0].displayName
                : title}
            </Text>
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
                  />
                )}
                rules={{
                  min: 1,
                }}
              />
            </BlockStack>
          )}
        </InlineStack>
        {variants?.length > 1 && (
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text as="h3" variant="headingMd">
                Variants
              </Text>
              <Text>Quantity</Text>
            </InlineStack>
            {variants.map(({ title: variantTitle, id: variantId }, index) => (
              <BlockStack key={index} gap={300}>
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="span">{variantTitle}</Text>
                  <Controller
                    control={control}
                    name={`${name}.${productVariantIds.indexOf(variantId.replace(/gid:\/\/shopify\/ProductVariant\//g, ""))}.quantity`}
                    render={({ field: { ref, ...fieldProps } }) => (
                      <TextField
                        {...fieldProps}
                        type="number"
                        autoComplete="off"
                        onChange={(value) => {
                          fieldProps.onChange(parseInt(value));
                        }}
                        value={fieldProps.value?.toString() || ""}
                      />
                    )}
                    rules={{
                      min: 1,
                    }}
                  />
                </InlineStack>
                {variants.length - 1 !== index && <Divider />}
              </BlockStack>
            ))}
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
};
