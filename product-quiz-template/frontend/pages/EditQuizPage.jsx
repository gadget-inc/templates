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

import { useCallback, useEffect } from "react";
import { useActionForm, useFindOne } from "@gadgetinc/react";
import { useNavigate } from "@shopify/app-bridge-react";
import { useParams } from "react-router-dom";

export default function EditQuizPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    control,
    submit,
    formState: { errors, isDirty, isValid, isSubmitting },
    getValues,
    watch,
  } = useActionForm(api.quiz.update, {
    mode: "onBlur",
    findBy: id,
    select: {
      id: true,
      title: true,
      body: true,
      questions: {
        edges: {
          node: {
            id: true,
            text: true,
            answers: {
              edges: {
                node: {
                  id: true,
                  text: true,
                  recommendedProduct: {
                    id: true,
                    productSuggestion: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const saveQuiz = useCallback(async () => {
    console.log("submitting", getValues());
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
  });

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
              Update Quiz
            </Text>
            <QuizForm
              isUpdating
              onSubmit={saveQuiz}
              {...{ control, errors, isDirty, isValid, getValues, watch }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </PageTemplate>
  );
}
