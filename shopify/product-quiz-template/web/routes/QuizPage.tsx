import { api } from "../api";
import { Layout, Card, Page } from "@shopify/polaris";
import { useNavigate, useParams } from "react-router-dom";
import { AutoForm } from "@gadgetinc/react/dist/cjs/auto/polaris";

export default () => {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <Page>
      <Layout sectioned>
        <Layout.Section>
          <Card>
            <AutoForm
              action={params?.id ? api.quiz.update : api.quiz.create}
              findBy={params?.id ?? ""}
              onSuccess={() => navigate("/")}
            ></AutoForm>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
