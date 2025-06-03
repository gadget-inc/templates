import { Card, Layout } from "@shopify/polaris";
import PageLayout from "../components/PageLayout";
import { useNavigate, useParams } from "@remix-run/react";
import {
  AutoBelongsToInput,
  AutoForm,
  AutoHasManyForm,
  AutoHasOneForm,
  AutoStringInput,
  AutoSubmit,
  SubmitResultBanner,
} from "@gadgetinc/react/auto/polaris";
import { api } from "../api";
import { ReactNode } from "react";

/**
 * Form wrapper for creating or updating quiz records.
 * Automatically switches between create and update modes based on whether an id is provided.
 *
 * @param props.children - Form input components to render
 * @param props.findBy - Quiz ID for update mode (optional)
 * @param props.onSuccess - Callback function executed after successful submission
 * @returns {JSX.Element} AutoForm component configured for quiz operations
 */
function Form(props: {
  children: ReactNode;
  findBy?: string;
  onSuccess: () => void;
}) {
  if (props.findBy) {
    return (
      <AutoForm
        action={api.quiz.update}
        findBy={props.findBy}
        onSuccess={props.onSuccess}
        select={{
          id: true,
          title: true,
          slug: true,
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
        }}
      >
        {props.children}
      </AutoForm>
    );
  } else {
    return (
      <AutoForm action={api.quiz.create} onSuccess={props.onSuccess}>
        {props.children}
      </AutoForm>
    );
  }
}

/**
 * Quiz management page component for creating new quizzes or editing existing ones.
 * Displays a form with nested questions, answers, and product recommendations.
 *
 * @returns {JSX.Element} Quiz creation/editing page with form inputs
 */
export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <PageLayout
      title={id ? "Refine your quiz" : "Design a quiz"}
      backAction={{ onAction: () => history.back() }}
    >
      <Layout.Section>
        <Card>
          <Form findBy={id} onSuccess={() => navigate("/")}>
            <SubmitResultBanner />
            <AutoStringInput field="title" />
            <AutoStringInput field="body" />
            <AutoHasManyForm field="questions">
              <AutoStringInput field="text" />
              <AutoHasManyForm field="answers">
                <AutoStringInput field="text" />
                <AutoHasOneForm field="recommendedProduct">
                  <AutoBelongsToInput field="productSuggestion" />
                </AutoHasOneForm>
              </AutoHasManyForm>
            </AutoHasManyForm>
            <AutoSubmit />
          </Form>
        </Card>
      </Layout.Section>
    </PageLayout>
  );
}
