import { api } from "../api";
import { Text, Layout, Card, Spinner, BlockStack } from "@shopify/polaris";
import { PageTemplate } from "../components";
import { QuizForm } from "../components";
import { useCallback } from "react";
import { FormProvider, useActionForm } from "@gadgetinc/react";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();

  const {
    submit,
    formState: { isValid, isSubmitting },
    originalFormMethods,
  } = useActionForm(api.quiz.create, {
    mode: "onBlur",
    defaultValues: {
      quiz: {
        questions: [
          {
            answers: [{}],
          },
        ],
      },
    },
    onError: (error) => console.log(error),
  });

  const saveQuiz = useCallback(async () => {
    const result = await submit();

    if (!result) {
      return;
    }

    const { data, error } = result;

    if (data) {
      navigate("/");
    } else {
      console.error("error submitting form", error);
    }
  }, [submit]);

  if (isValid && isSubmitting) {
    return (
      <PageTemplate>
        <Layout sectioned>
          <Layout.Section>
            <BlockStack inlineAlign="center">
              <Spinner /> <span>Saving Quiz...</span>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <Layout sectioned>
        <Layout.Section>
          <Card>
            <Text as="h2" variant="headingLg">
              Create a new quiz
            </Text>
            <FormProvider {...originalFormMethods}>
              <QuizForm onSubmit={saveQuiz} />
            </FormProvider>
          </Card>
        </Layout.Section>
      </Layout>
    </PageTemplate>
  );
};
