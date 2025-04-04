import { useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { ReactNode } from "react";
import { api } from "../api";
import {
  AutoForm,
  AutoHasManyThroughForm,
  AutoHasManyThroughJoinModelForm,
  AutoInput,
  AutoStringInput,
  AutoSubmit,
  SubmitResultBanner,
} from "@gadgetinc/react/auto/polaris";
import PageLayout from "../components/PageLayout";
import type { OutletContext } from "./_app";
import { Card, Layout } from "@shopify/polaris";

const Form = (props: {
  children: ReactNode;
  findBy?: string;
  onSuccess: () => void;
}) => {
  if (props.findBy) {
    return (
      <AutoForm
        action={api.bundle.update}
        findBy={props.findBy}
        onSuccess={props.onSuccess}
        select={{
          id: true,
          title: true,
          price: true,
          status: true,
          description: true,
          bundleComponents: {
            edges: {
              node: {
                id: true,
                productVariant: {
                  id: true,
                  title: true,
                  product: {
                    title: true,
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
      <AutoForm action={api.bundle.create} onSuccess={props.onSuccess}>
        {props.children}
      </AutoForm>
    );
  }
};

export default function () {
  const { id } = useParams();
  const { bundleCount } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  return (
    <PageLayout
      title={id ? "Edit Bundle" : "Create Bundle"}
      backAction={bundleCount ? { onAction: () => history.back() } : undefined}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Form findBy={id} onSuccess={() => navigate("/")}>
              <SubmitResultBanner />
              <AutoInput field="title" />
              <AutoInput field="price" />
              <AutoInput field="status" />
              <AutoStringInput field="description" multiline={4} />
              <AutoHasManyThroughForm
                field="productVariants"
                recordLabel={{ primary: ({ record }) => <></> }}
              >
                <AutoHasManyThroughJoinModelForm>
                  <AutoInput field="quantity" />
                </AutoHasManyThroughJoinModelForm>
              </AutoHasManyThroughForm>
              <AutoSubmit />
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </PageLayout>
  );
}
