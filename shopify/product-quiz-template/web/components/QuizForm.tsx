import { useFindMany, useFormContext } from "@gadgetinc/react";
import {
  FormLayout,
  TextField,
  Text,
  Button,
  Spinner,
  BlockStack,
  Card,
  Form,
  Icon,
} from "@shopify/polaris";
import { api } from "../api";
import { default as Answers } from "./Answers";
import { Controller, useFieldArray } from "@gadgetinc/react";
import { PlusCircleIcon } from "@shopify/polaris-icons";

export default ({
  isUpdating,
  onSubmit,
}: {
  isUpdating?: boolean;
  onSubmit: () => Promise<void>;
}) => {
  const {
    control,
    formState: { errors, isDirty },
  } = useFormContext();

  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "quiz.questions",
  });

  const [productsResponse] = useFindMany(api.shopifyProduct, {
    select: {
      id: true,
      title: true,
      images: {
        edges: {
          node: {
            id: true,
            source: true,
          },
        },
      },
    },
  });

  if (productsResponse.fetching) {
    return (
      <BlockStack inlineAlign="center">
        <Spinner /> <span>Fetching products...</span>
      </BlockStack>
    );
  }

  return (
    <Form onSubmit={onSubmit}>
      <FormLayout>
        <BlockStack inlineAlign="end">
          <Button size="large" variant="primary" submit disabled={!isDirty}>
            {isUpdating ? "Save quiz" : "Create quiz"}
          </Button>
        </BlockStack>

        <Controller
          name="quiz.title"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field: { ref, ...fieldProps } }) => (
            <TextField
              requiredIndicator
              label="Name"
              autoComplete="off"
              error={
                (errors.quiz as { title?: { message: string } })?.title?.message
              }
              {...fieldProps}
            />
          )}
        />

        <Controller
          name="quiz.body"
          control={control}
          rules={{ required: "Description is required" }}
          render={({ field: { ref, ...fieldProps } }) => (
            <TextField
              requiredIndicator
              label="Description"
              autoComplete="off"
              error={
                (errors.quiz as { body?: { message: string } })?.body?.message
              }
              {...fieldProps}
            />
          )}
        />

        <Text variant="headingMd" as="h2">
          Quiz questions
        </Text>

        {questions.map((_quizQuestion, i) => (
          <Card key={_quizQuestion.id}>
            <BlockStack inlineAlign="end">
              <Button
                disabled={questions.length <= 1}
                tone="critical"
                onClick={() => {
                  removeQuestion(i);
                }}
              >
                Remove
              </Button>
            </BlockStack>

            <BlockStack gap="500">
              <Controller
                name={`quiz.questions.${i}.text`}
                control={control}
                rules={{ required: "Field is required" }}
                render={({ field: { ref, ...fieldProps } }) => (
                  <TextField
                    requiredIndicator
                    label="Question"
                    autoComplete="off"
                    error={
                      (
                        errors.quiz as {
                          questions?: {
                            [key: string]: { text?: { message: string } };
                          };
                        }
                      )?.questions?.[i]?.text?.message
                    }
                    {...fieldProps}
                  />
                )}
              />

              <Answers
                name={`quiz.questions.${i}.answers`}
                questionIndex={i}
                products={productsResponse.data}
              />
            </BlockStack>
          </Card>
        ))}

        <Button
          variant="monochromePlain"
          icon={<Icon source={PlusCircleIcon} />}
          onClick={() =>
            addQuestion({
              answers: [{ text: "" }],
            })
          }
        >
          Add question
        </Button>
        <BlockStack inlineAlign="end">
          <Button variant="primary" submit disabled={!isDirty}>
            {isUpdating ? "Save quiz" : "Create quiz"}
          </Button>
        </BlockStack>
      </FormLayout>
    </Form>
  );
};
