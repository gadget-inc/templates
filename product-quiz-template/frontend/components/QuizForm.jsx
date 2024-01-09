import { useFindMany } from "@gadgetinc/react";
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
import { Answers } from "./Answers";
import { Controller, useFieldArray } from "@gadgetinc/react";
import { CirclePlusMajor } from "@shopify/polaris-icons";

export function QuizForm({
  isUpdating,
  onSubmit,
  control,
  errors,
  isDirty,
  watch,
  getValues,
}) {
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
          <Button size="large" primary submit disabled={!isDirty}>
            {isUpdating ? "Save quiz" : "Create quiz"}
          </Button>
        </BlockStack>

        <Controller
          name="quiz.title"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => {
            const { ref, ...fieldProps } = field;

            return (
              <TextField
                requiredIndicator
                label="Name"
                autoComplete="off"
                error={errors.quiz?.title?.message}
                {...fieldProps}
              />
            );
          }}
        />

        <Controller
          name="quiz.body"
          control={control}
          rules={{ required: "Description is required" }}
          render={({ field }) => {
            const { ref, ...fieldProps } = field;

            return (
              <TextField
                requiredIndicator
                label="Description"
                autoComplete="off"
                error={errors.quiz?.body?.message}
                {...fieldProps}
              />
            );
          }}
        />

        <Text variant="headingMd" as="h2">
          Quiz questions
        </Text>

        {questions.map((_quizQuestion, i) => (
          <Card sectioned subdued key={_quizQuestion.id}>
            <BlockStack inlineAlign="end">
              <Button
                disabled={questions.length <= 1}
                destructive
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
                render={({ field }) => {
                  const { ref, ...fieldProps } = field;

                  return (
                    <TextField
                      requiredIndicator
                      label="Question"
                      autoComplete="off"
                      error={errors.quiz?.questions?.[i]?.text?.message}
                      {...fieldProps}
                    />
                  );
                }}
              />

              <Answers
                name={`quiz.questions.${i}.answers`}
                questionIndex={i}
                products={productsResponse.data}
                {...{ control, errors, getValues, watch }}
              />
            </BlockStack>
          </Card>
        ))}

        <Button
          variant="plain"
          icon={<Icon source={CirclePlusMajor} />}
          onClick={() =>
            addQuestion({
              answers: [{ text: "" }],
            })
          }
        >
          Add question
        </Button>
        <BlockStack inlineAlign="end">
          <Button primary submit disabled={!isDirty}>
            {isUpdating ? "Save quiz" : "Create quiz"}
          </Button>
        </BlockStack>
      </FormLayout>
    </Form>
  );
}
