import { AutoForm } from "@gadgetinc/react/auto/polaris";
import { Layout, Page } from "@shopify/polaris";
import { api } from "../api";
import { useFindFirst } from "@gadgetinc/react";

export function IndexPage() {
  const [{ data: shop, fetching }] = useFindFirst(api.shopifyShop, {
    select: {
      id: true,
    },
  });

  if (fetching) {
    return <div>Loading...</div>;
  }

  if (!shop && !fetching) {
    return <div>Issue finding shop, take a look at your backend logs</div>;
  }

  return (
    <Page>
      <Layout>
        <Layout.Section>
          {shop && (
            <AutoForm
              title="Update notification frequency"
              action={api.shopifyShop.update}
              include={["defaultUpdateFrequency"]}
              findBy={shop.id}
            />
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
