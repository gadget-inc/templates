import { useAction, useFindMany, useFindFirst } from "@gadgetinc/react";
import { Banner, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { api } from "./api";
import { PlanCard } from "./components";
import { useCallback } from "react";
import { useNavigate } from "@shopify/app-bridge-react";

const ShopPage = () => {
  const navigate = useNavigate();

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop, {
      select: {
        id: true,
        currency: true,
        plan: {
          id: true,
          name: true,
        },
      },
    });

  const [{ data: plans, fetching: fetchingPlans, error: errorFetchingPlans }] =
    useFindMany(api.plan, {
      select: {
        id: true,
        name: true,
        description: true,
        monthlyPrice: true,
      },
    });

  const [_, subscribe] = useAction(api.shopifyShop.subscribe, {
    select: {
      confirmationUrl: true,
    },
  });

  const handleSubscribe = useCallback(
    async (planId) => {
      const res = await subscribe({ id: shop.id, planId });

      if (res?.data?.confirmationUrl) {
        navigate(res.data.confirmationUrl);
      }
    },
    [shop, subscribe]
  );

  return (
    <Page title="Plan Selection Page">
      <Layout>
        <Layout.Section>
          {shop?.plan?.id && (
            <Banner
              title={`This shop is assigned to the ${shop?.plan?.name} plan`}
              tone="success"
            />
          )}
        </Layout.Section>
        <Layout.Section>
          <InlineStack gap="400">
            {!fetchingPlans && plans ? (
              plans?.map((plan) => (
                <PlanCard
                  key={plan.id}
                  id={plan.id}
                  name={plan.name}
                  description={plan.description}
                  monthlyPrice={plan.monthlyPrice}
                  currency={shop?.currency || "CAD"}
                  handleSubscribe={handleSubscribe}
                  buttonDisabled={shop?.plan?.id === plan.id}
                />
              ))
            ) : (
              <Text as="p" variant="bodyLg">
                There are no plans in the database. Please make sure to add
                plans using the API Playground. Since the database is split
                between development and production, make sure to also add plans
                to your production database once deploying and going live.
              </Text>
            )}
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopPage;
