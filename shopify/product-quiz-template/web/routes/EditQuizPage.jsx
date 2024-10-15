import { api } from "../api";
import { Text, Layout, Card, Spinner, BlockStack } from "@shopify/polaris";
import { PageTemplate } from "../components";
import { QuizForm } from "../components";
import { useCallback } from "react";
import { useActionForm } from "@gadgetinc/react";
import { useParams, useNavigate } from "react-router-dom";

export default () => {
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
};
