import { api } from "../api";
import { Layout, Card, Page } from "@shopify/polaris";
import { useNavigate, useParams } from "react-router-dom";
import {
  AutoForm,
  AutoHasManyForm,
  AutoHasOneInput,
  AutoStringInput,
  AutoSubmit,
  SubmitResultBanner,
} from "@gadgetinc/react/auto/polaris";

const Form = (props: {
  children: React.ReactNode;
  findBy?: string;
  onSuccess: () => void;
}) => {
  if (props.findBy) {
    return (
      <AutoForm
        action={api.quiz.update}
        findBy={props.findBy}
        onSuccess={props.onSuccess}
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

export default () => {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <Page backAction={{ onAction: () => navigate("/") }}>
      <Layout sectioned>
        <Layout.Section>
          <Card>
            <Form findBy={params.id} onSuccess={() => navigate("/")}>
              <SubmitResultBanner />
              <AutoStringInput field="title" />
              <AutoStringInput field="body" />
              <AutoHasManyForm field="questions">
                <AutoStringInput field="text" />
                <AutoHasManyForm field="answers">
                  <AutoStringInput field="text" />
                  <AutoHasOneInput field="recommendedProduct" />
                </AutoHasManyForm>
              </AutoHasManyForm>
              <AutoSubmit />
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
