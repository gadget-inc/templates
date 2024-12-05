import { useFindMany } from "@gadgetinc/react";
import {
  Banner,
  BlockStack,
  Button,
  Card,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { api } from "../api";
import { PlanCard, StyledSpinner } from "../components";
import { useCallback, useEffect, useState, useContext } from "react";
import { ShopContext } from "../providers";

// This is the billing page that will be displayed when a user hasn't selected a plan or they want to change plans.
export default () => {
  const { gadgetMetadata } = useContext(ShopContext);
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");

  const [{ data: plans, fetching: fetchingPlans, error: errorFetchingPlans }] =
    useFindMany(api.plan, {
      select: {
        id: true,
        name: true,
        description: true,
        pricePerOrder: true,
        trialDays: true,
        cappedAmount: true,
      },
    });

  // Dismisses the error banner
  const handleDismiss = useCallback(() => {
    setShow(false);
  }, []);

  // useEffect for showing an error banner when there's an issue fetching plans
  useEffect(() => {
    if (!fetchingPlans && errorFetchingPlans) {
      setBannerContext(errorFetchingPlans.message);
      setShow(true);
    } else if (fetchingPlans) {
      setShow(false);
    }
  }, [fetchingPlans, errorFetchingPlans]);

  if (fetchingPlans) {
    return <StyledSpinner />;
  }

  return (
    <Page title="Select a plan">
      <BlockStack gap="500">
        {show && (
          <Banner
            title={bannerContext}
            tone="critical"
            onDismiss={handleDismiss}
          />
        )}
        <Layout>
          {plans?.length ? (
            plans?.map((plan) => (
              <Layout.Section variant="oneThird" key={plan.id}>
                <PlanCard
                  id={plan.id}
                  name={plan.name}
                  description={plan.description}
                  pricePerOrder={plan.pricePerOrder}
                  trialDays={plan.trialDays}
                  cappedAmount={plan.cappedAmount}
                />
              </Layout.Section>
            ))
          ) : (
            <Layout.Section>
              <Card>
                <BlockStack gap="300">
                  <Text as="p" variant="bodyLg">
                    There are no plans in the database. Please make sure to add
                    plans using the API Playground. Since the database is split
                    between development and production, make sure to also add
                    plans to your production database once deploying and going
                    live.
                  </Text>
                  <Button
                    variant="primary"
                    onClick={() =>
                      open(
                        `${gadgetMetadata?.gadgetMeta?.productionRenderURL}api/playground/javascript?code=${encodeURIComponent(`await api.plan.create({
  cappedAmount: 123,
  currency: "CAD",
  description: "example value for description",
  name: "Some plan name",
  pricePerOrder: 123,
  trialDays: 7,
})`)}&environment=${gadgetMetadata?.gadgetMeta?.environmentName?.toLowerCase()}`,
                        "_blank"
                      )
                    }
                  >
                    Create a plan
                  </Button>
                </BlockStack>
              </Card>
            </Layout.Section>
          )}
        </Layout>
      </BlockStack>
    </Page>
  );
};
