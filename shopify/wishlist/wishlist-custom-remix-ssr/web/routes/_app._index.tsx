import { AutoForm } from "@gadgetinc/react/auto/polaris";
import { Layout, Page } from "@shopify/polaris";
import { api } from "../api";
import { json, type LoaderFunctionArgs } from "@remix-run/router";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  return json({
    shop: await context.api.shopifyShop.findFirst({
      select: {
        id: true,
      },
    }),
  });
};

export default function Index() {
  const { shop } = useLoaderData<typeof loader>();
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
