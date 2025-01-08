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
import { Fragment } from "react";
import { useFieldArray, Controller, useFormContext } from "@gadgetinc/react";
import { PlusCircleIcon, XCircleIcon, ImageIcon } from "@shopify/polaris-icons";
import type { GadgetRecordList } from "@gadget-client/product-quiz-template";

type QuizError = {
  questions?: {
    [key: string]: {
      answers?: {
        [key: string]: {
          text?: {
            message: string;
          };
          recommendedProduct?: {
            productSuggestion?: {
              id?: {
                message: string;
              };
            };
          };
        };
      };
    };
  };
};

type ProductImages = {
  [key: string]: string;
};

const AnswerImage = ({
  name,
  answerIndex,
  productImages,
}: {
  name: string;
  answerIndex: number;
  productImages: ProductImages | undefined;
}) => {
  const { watch } = useFormContext();

  const productSuggestionWatch = watch(
    `${name}.${answerIndex}.recommendedProduct.productSuggestion.id`
  );

  return productSuggestionWatch ? (
    <BlockStack inlineAlign="center">
      {productImages?.[productSuggestionWatch] ? (
        <Thumbnail
          size="large"
          alt={name}
          source={productImages?.[productSuggestionWatch]}
        />
      ) : (
        <Thumbnail size="large" alt={name} source={ImageIcon} />
      )}
    </BlockStack>
  ) : undefined;
};

export default ({
  name,
  questionIndex,
  products,
}: {
  name: string;
  questionIndex: number;
  products:
    | GadgetRecordList<{
        id: string;
        title: string | null;
        media: {
          edges: {
            node: {
              id: string;
              url: string | null;
            };
          }[];
        };
      }>
    | undefined;
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const {
    fields: answers,
    append: addAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control,
    name,
  });

  const productsOptions = products?.map((p, i) => ({
    label: p.title ?? "",
    value: p.id,
    key: String(i),
  }));

  const productsImageMap: ProductImages | undefined = products?.reduce(
    (acc: ProductImages, p) => {
      acc[p.id] = p.media.edges[0]?.node?.url ?? "";

      return acc;
    },
    {}
  );

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
                render={({ field: { ref, ...fieldProps } }) => (
                  <TextField
                    requiredIndicator
                    label={`Answer ${i + 1}`}
                    autoComplete="off"
                    {...fieldProps}
                    error={
                      (errors.quiz as QuizError)?.questions?.[questionIndex]
                        ?.answers?.[i]?.text?.message
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name={`${name}.${i}.recommendedProduct.productSuggestion.id`}
                rules={{ required: "Required" }}
                render={({ field: { ref, ...fieldProps } }) => (
                  <Select
                    label="Recommended product"
                    placeholder="-"
                    options={productsOptions}
                    requiredIndicator
                    error={
                      (errors.quiz as QuizError)?.questions?.[questionIndex]
                        ?.answers?.[i]?.recommendedProduct?.productSuggestion
                        ?.id?.message
                    }
                    {...fieldProps}
                  />
                )}
              />
            </FormLayout.Group>

            <AnswerImage
              answerIndex={i}
              productImages={productsImageMap}
              {...{ name }}
            />

            <Button
              icon={<Icon source={XCircleIcon} />}
              variant="monochromePlain"
              disabled={answers.length <= 1}
              onClick={() => removeAnswer(i)}
            ></Button>
          </InlineStack>
          <br />
        </Fragment>
      ))}

      <BlockStack inlineAlign="start">
        <Button
          variant="monochromePlain"
          icon={<Icon source={PlusCircleIcon} />}
          onClick={() => addAnswer({ text: "" })}
        >
          Add answer
        </Button>
      </BlockStack>
    </BlockStack>
  );
};
