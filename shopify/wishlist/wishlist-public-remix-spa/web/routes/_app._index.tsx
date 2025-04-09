import { AutoForm } from "@gadgetinc/react/auto/polaris";
import { Layout, Page } from "@shopify/polaris";
import { api } from "../api";
import { useLoaderData } from "@remix-run/react";

export const clientLoader = async () => {
  return {
    shop: await api.shopifyShop.findFirst({
      select: {
        id: true,
      },
    }),
  };
};

export default function Index() {
  const { shop } = useLoaderData<typeof clientLoader>();
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <AutoForm
            title="Update notification frequency"
            action={api.shopifyShop.update}
            include={["defaultUpdateFrequency"]}
            findBy={shop.id}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
