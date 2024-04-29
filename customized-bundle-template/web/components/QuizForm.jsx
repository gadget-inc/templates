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
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ShopContext } from "../providers";
import { useAppBridge } from "@shopify/app-bridge-react";

export default ({ control, errors, getValues, watch, setValue }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { shop } = useContext(ShopContext);
  const shopify = useAppBridge();

  const orignalBundleComponents = useMemo(
    () => getValues("bundle.bundleComponents"),
    []
  );

  console.log("Shop in form", shop);

  // const orignalBundleComponents = [
  //   {
  //     id: "1234567890",
  //     variant: {
  //       id: "44396095013161",
  //       title: "Meow",
  //       product: { id: "8108738543913", title: "Cat" },
  //       productImage: {
  //         id: "40376772559145",
  //         source:
  //           "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg",
  //       },
  //     },
  //   },
  // ];

  const { replace: replaceBundleComponents } = useFieldArray({
    control,
    name: "bundle.bundleComponents",
  });

  const handleSelection = useCallback(
    (selection) => {
      if (!selection) return;

      console.log("SELECTION", selection);

      setSelectedProducts(selection);

      if (selection) {
        const tempArr = [];
        const variants = selection
          .reduce((variants, product) => {
            return variants.concat(product.variants);
          }, [])
          .map((variant) => ({
            id: variant.id.replace(/gid:\/\/shopify\/ProductVariant\//g, ""),
          }));

        if (!variants?.length)
          // return setValue("bundle.bundleComponents", tempArr);
          return replaceBundleComponents(tempArr);

        for (const variant of variants) {
          let value;

          if (orignalBundleComponents?.length) {
            for (const bundleComponent of orignalBundleComponents) {
              if (bundleComponent.variant.id === variant.id) {
                value = { id: bundleComponent.id };
                break;
              }
            }
          }

          if (!value)
            value = {
              shop: { _link: shop.id },
              variant: { _link: variant.id },
            };

          tempArr.push(value);
        }

        console.log("TEMP ARR", tempArr);

        // setValue("bundle.bundleComponents", tempArr);
        replaceBundleComponents(tempArr);

        console.log(getValues("bundle.bundleComponents"));

        // bundleComponent returned from the API
        // id: true,
        // variant: {
        //   id: true,
        //   productId: true,
        // },

        // Arr comparison { id: ""}, { variant: { _link: ""}}
      }
    },
    [shop]
  );

  useEffect(() => {
    if (orignalBundleComponents?.length) {
      const tempObj = {};

      for (const bundleComponent of orignalBundleComponents) {
        if (!tempObj[bundleComponent.variant.product.id]) {
          tempObj[bundleComponent.variant.product.id] = {
            id: `gid://shopify/Product/${bundleComponent.variant.product.id}`,
            title: bundleComponent.variant.product.title,
            variants: [
              {
                id: `gid://shopify/ProductVariant/${bundleComponent.variant.id}`,
                title: bundleComponent.variant.title,
              },
            ],
            images: [
              {
                id: `gid://shopify/ProductImage/${bundleComponent.variant.productImage.id}`,
                originalSrc: bundleComponent.variant.productImage.source,
              },
            ],
          };
        } else {
          tempObj[bundleComponent.variant.product.id].variants.push({
            id: `gid://shopify/ProductVariant/${bundleComponent.variant.id}`,
            title: bundleComponent.variant.title,
          });
        }
      }

      setSelectedProducts(Object.values(tempObj));
    }
  }, []);

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

        {/* <Controller
      name="price"
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
          />
        );
      }}
    /> */}
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
                      {variants.map(({ id, title }) => (
                        <Badge key={id}>{title}</Badge>
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
