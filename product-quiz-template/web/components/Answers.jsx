// @ts-nocheck
import {
  TextField,
  BlockStack,
  Select,
  Button,
  Thumbnail,
  Icon,
  InlineStack,
  FormLayout,
} from "@shopify/polaris";
import { CircleCancelMajor } from "@shopify/polaris-icons";
import { Fragment } from "react";
import { useFieldArray, Controller } from "@gadgetinc/react";
import { CirclePlusMajor } from "@shopify/polaris-icons";

const AnswerImage = ({ name, answerIndex, productImages, watch }) => {
  const productSuggestionWatch = watch(
    `${name}.${answerIndex}.recommendedProduct.productSuggestion.id`
  );

  return productSuggestionWatch ? (
    <BlockStack inlineAlign="center">
      {productImages[productSuggestionWatch] ? (
        <Thumbnail  
          size="large"
          alt={name}
          source={productImages[productSuggestionWatch]}
        />
      ) : (
        <p>no image</p>
      )}
    </BlockStack>
  ) : undefined;
};

export function Answers({
  name,
  questionIndex,
  products,
  control,
  errors,
  watch,
}) {
  const {
    fields: answers,
    append: addAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control,
    name,
  });

  const productsOptions = products.map((p, i) => ({
    label: p.title,
    value: p.id,
    key: i,
  }));

  const productsImageMap = products.reduce((acc, p) => {
    acc[p.id] = p.images.edges[0]?.node?.source;

    return acc;
  }, {});

  return (
    <BlockStack>
      {answers.map((_answer, i) => (
        <Fragment key={_answer.id}>
          <InlineStack blockAlign="center" gap="500">
            <FormLayout.Group>
              <Controller
                control={control}
                name={`${name}.${i}.text`}
                rules={{ required: "Required" }}
                render={({ field }) => {
                  const { ref, ...fieldProps } = field;

                  return (
                    <TextField
                      requiredIndicator
                      label={`Answer ${i + 1}`}
                      autoComplete="off"
                      {...fieldProps}
                      error={
                        errors.quiz?.questions?.[questionIndex]?.answers?.[i]
                          ?.text?.message
                      }
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name={`${name}.${i}.recommendedProduct.productSuggestion.id`}
                rules={{ required: "Required" }}
                render={({ field }) => {
                  const { ref, ...fieldProps } = field;

                  return (
                    <Select
                      label="Recommended product"
                      placeholder="-"
                      options={productsOptions}
                      requiredIndicator
                      error={
                        errors.quiz?.questions?.[questionIndex]?.answers?.[i]
                          ?.recommendedProduct?.productSuggestion?.id?.message
                      }
                      {...fieldProps}
                    />
                  );
                }}
              />
            </FormLayout.Group>

            <AnswerImage
              answerIndex={i}
              productImages={productsImageMap}
              {...{ name, watch }}
            />

            <Button
              icon={<Icon source={CircleCancelMajor} />}
              plain
              disabled={answers.length <= 1}
              onClick={() => removeAnswer(i)}
            ></Button>
          </InlineStack>
          <br />
        </Fragment>
      ))}

      <BlockStack inlineAlign="start">
        <Button
          variant="plain"
          icon={<Icon source={CirclePlusMajor} />}
          onClick={() => addAnswer({ text: "" })}
        >
          <p>Add answer</p>
        </Button>
      </BlockStack>
    </BlockStack>
  );
}
