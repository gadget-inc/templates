import { useAction, useFindMany } from "@gadgetinc/react";
import {
  Banner,
  BlockStack,
  Layout,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { api } from "./api";
import { PlanCard } from "./components";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { trialCalculations } from "./utilities";
import { ShopContext } from "./providers";

/**
 * This is the billing page that will be displayed when a user hasn't selected a plan or they want to change plans.
 *
 * @returns { import("react").ReactElement } A React functional component
 */
export default () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const { shop, prices, currentCappedAmount } = useContext(ShopContext);

  const [{ data: plans, fetching: fetchingPlans, error: errorFetchingPlans }] =
    useFindMany(api.plan, {
      select: {
        id: true,
        name: true,
        description: true,
        pricePerOrder: true,
        trialDays: true,
        currency: true,
        cappedAmount: true,
      },
      sort: {
        pricePerOrder: "Ascending", // Prices from lowest to highest
      },
    });

  const [
    {
      data: subscription,
      fetching: fetchingSubscription,
      error: errorSubscribing,
    },
    subscribe,
  ] = useAction(api.shopifyShop.subscribe, {
    select: {
      confirmationUrl: true,
    },
  });

  /**
   * @type { (planId: string) => void }
   *
   * Callback used to subscribe to a plan and redirect to the Shopify subscription confirmation page
   */
  const handleSubscribe = useCallback(
    async (planId) => {
      const res = await subscribe({ id: shop.id, planId });

      if (res?.data?.confirmationUrl) {
        navigate(res.data.confirmationUrl);
      }
    },
    [shop, subscribe]
  );

  /**
   * @type { () => void }
   *
   * Dismisses the error banner
   */
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

  // useEffect for showing an error banner when there's an issue subscribing
  useEffect(() => {
    if (!fetchingSubscription && errorSubscribing) {
      setBannerContext(errorSubscribing.message);
      setShow(true);
    } else if (fetchingSubscription) {
      setShow(false);
    }
  }, [fetchingSubscription, errorSubscribing]);

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
          {!fetchingPlans ? (
            plans.length ? (
              plans?.map((plan) => (
                <Layout.Section variant="oneThird" key={plan.id}>
                  <PlanCard
                    id={plan.id}
                    name={plan.name}
                    description={plan.description}
                    pricePerOrder={prices[plan.id]}
                    trialDays={
                      trialCalculations(
                        shop?.usedTrialMinutes,
                        shop?.trialStartedAt,
                        new Date(),
                        plan.trialDays
                      ).availableTrialDays
                    }
                    currency={shop?.currency || "CAD"}
                    cappedAmount={currentCappedAmount || plan.cappedAmount}
                    handleSubscribe={handleSubscribe}
                    buttonDisabled={
                      subscription ||
                      fetchingSubscription ||
                      shop?.plan?.id === plan.id
                    }
                  />
                </Layout.Section>
              ))
            ) : (
              <Text as="p" variant="bodyLg">
                There are no plans in the database. Please make sure to add
                plans using the API Playground. Since the database is split
                between development and production, make sure to also add plans
                to your production database once deploying and going live.
              </Text>
            )
          ) : (
            <Spinner />
          )}
        </Layout>
      </BlockStack>
    </Page>
  );
};
