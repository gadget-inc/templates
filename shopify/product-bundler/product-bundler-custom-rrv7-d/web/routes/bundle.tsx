import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
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
import type { OutletContext } from "../components/App";
import { Card, Layout } from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import { useAction } from "@gadgetinc/react";

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
                quantity: true,
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
  const { variantMap } = useLoaderData();

  const [, deleteBundle] = useAction(api.bundle.delete);

  return (
    <PageLayout
      title={id ? "Edit Bundle" : "Create Bundle"}
      backAction={bundleCount ? { onAction: () => history.back() } : undefined}
      primaryAction={
        id
          ? {
              icon: DeleteIcon,
              onAction: async () => {
                await deleteBundle({ id });
                navigate("/");
              },
            }
          : undefined
      }
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
                recordLabel={{
                  primary: ({ record: { id, title } }) => (
                    <>
                      {title == "Default Title" ? variantMap[id].title : title}
                    </>
                  ),
                }}
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
