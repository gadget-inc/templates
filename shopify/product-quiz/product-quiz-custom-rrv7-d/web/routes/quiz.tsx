import { Card, Layout } from "@shopify/polaris";
import PageLayout from "../components/PageLayout";
import { useNavigate, useParams } from "react-router";
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

const Form = (props: {
  children: ReactNode;
  findBy?: string;
  onSuccess: () => void;
}) => {
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
};

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
