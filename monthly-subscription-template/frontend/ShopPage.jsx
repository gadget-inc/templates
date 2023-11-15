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

const ShopPage = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const { shop, availableTrialDays, prices } = useContext(ShopContext);

  const [{ data: plans, fetching: fetchingPlans, error: errorFetchingPlans }] =
    useFindMany(api.plan, {
      select: {
        id: true,
        name: true,
        description: true,
        monthlyPrice: true,
        trialDays: true,
        currency: true,
      },
      sort: {
        monthlyPrice: "Ascending", // Prices from lowest to highest
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
    <Page title="Plan Selection Page">
      <BlockStack gap="500">
        {show && (
          <Banner
            title={bannerContext}
            tone="critical"
            onDismiss={handleDismiss}
          />
        )}
        {shop?.plan?.id && (
          <Banner
            title={`This shop is assigned to the ${shop?.plan?.name} plan`}
            tone="success"
          >
            {availableTrialDays && (
              <Text as="p" variant="bodyMd">
                You have <strong>{availableTrialDays}</strong> trial days
                remaining.
              </Text>
            )}
          </Banner>
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
                    monthlyPrice={prices[plan.id]}
                    trialDays={
                      trialCalculations(
                        shop?.usedTrialMinutes,
                        shop?.usedTrialMinutesUpdatedAt,
                        new Date(),
                        plan.trialDays
                      ).availableTrialDays
                    }
                    currency={shop?.currency || "CAD"}
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

export default ShopPage;
