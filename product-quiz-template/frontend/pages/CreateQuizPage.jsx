import { api } from "../api";
import { useAction } from "@gadgetinc/react";

import {
  Text,
  Layout,
  Card,
  Spinner,
  Banner,
  BlockStack,
} from "@shopify/polaris";
import { PageTemplate } from "../components/PageTemplate";
import { QuizForm } from "../components/QuizForm";

import { useCallback } from "react";
import { useActionForm } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";

export default function CreateQuizPage() {
  const navigate = useNavigate();

  const {
    control,
    submit,
    formState: { errors, isDirty, isValid, isSubmitting },
    getValues,
    watch,
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
      console.log("error submitting form", error);
    }
  }, []);

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
          {/* {createQuizResponse.error && (
            <Banner title="Error on quiz creation" status="critical">
              <p>{createQuizResponse.error.message}</p>
            </Banner>
          )} */}
          <Card>
            <Text as="h2" variant="headingLg">
              Create a new quiz
            </Text>
            <QuizForm
              onSubmit={saveQuiz}
              {...{ control, errors, isDirty, isValid, getValues, watch }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </PageTemplate>
  );
}
