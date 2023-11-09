import {
  useAction,
  useFindMany,
  useFindFirst,
  useGlobalAction,
} from "@gadgetinc/react";
import {
  Banner,
  InlineStack,
  Layout,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { api } from "./api";
import { PlanCard } from "./components";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { calculateTrialDays } from "./utilities";

const ShopPage = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState({});
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const [trialDays, setTrialDays] = useState(0);

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop, {
      select: {
        id: true,
        currency: true,
        usedTrialDays: true,
        usedTrialDaysUpdatedAt: true,
        plan: {
          id: true,
          name: true,
          trialDays: true,
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
        trialDays: true,
        currency: true,
      },
    });

  // Use the error variable from this call to show a toast
  const [
    {
      data: subscriptionData,
      fetching: fetchingSubscription,
      error: errorSubscribing,
    },
    subscribe,
  ] = useAction(api.shopifyShop.subscribe, {
    select: {
      confirmationUrl: true,
    },
  });

  const [_, convertCurrency] = useGlobalAction(api.planCurrencyToShopCurrency);

  const handleSubscribe = useCallback(
    async (planId) => {
      const res = await subscribe({ id: shop.id, planId });

      if (res?.data?.confirmationUrl) {
        navigate(res.data.confirmationUrl);
      }
    },
    [shop, subscribe]
  );

  const handleDismiss = useCallback(() => {
    setShow(false);
  }, []);

  useEffect(() => {
    const run = async () => {
      const { data } = await convertCurrency();
      setPrices(data);
    };
    run();
  }, []);

  useEffect(() => {
    if (!fetchingShop && errorFetchingShop) {
      setBannerContext(errorFetchingShop.message);
      setShow(true);
    } else if (fetchingShop) {
      setShow(false);
    }
  }, [fetchingShop, errorFetchingShop]);

  useEffect(() => {
    if (!fetchingPlans && errorFetchingPlans) {
      setBannerContext(errorFetchingPlans.message);
      setShow(true);
    } else if (fetchingPlans) {
      setShow(false);
    }
  }, [fetchingPlans, errorFetchingPlans]);

  useEffect(() => {
    if (!fetchingSubscription && errorSubscribing) {
      setBannerContext(errorSubscribing.message);
      setShow(true);
    } else if (fetchingSubscription) {
      setShow(false);
    }
  }, [fetchingSubscription, errorSubscribing]);

  useEffect(() => {
    if (!fetchingShop && shop) {
      setTrialDays(
        calculateTrialDays(
          shop.usedTrialDays,
          shop.usedTrialDaysUpdatedAt,
          new Date(),
          shop.plan.trialDays
        ).availableTrialDays
      );
    }
  }, [fetchingShop]);

  return (
    <Page title="Plan Selection Page">
      <Layout>
        <Layout.Section>
          {!fetchingSubscription && errorSubscribing && show && (
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
              {trialDays && (
                <Text as="p" variant="bodyMd">
                  You have <strong>{trialDays}</strong> trial days remaining.
                </Text>
              )}
            </Banner>
          )}
        </Layout.Section>
        <Layout.Section>
          <InlineStack gap="400">
            {!fetchingPlans ? (
              plans.length ? (
                plans?.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    id={plan.id}
                    name={plan.name}
                    description={plan.description}
                    monthlyPrice={prices[plan.id] || plan.monthlyPrice}
                    trialDays={
                      calculateTrialDays(
                        shop?.usedTrialDays,
                        shop?.usedTrialDaysUpdatedAt,
                        new Date(),
                        plan.trialDays
                      ).availableTrialDays
                    }
                    currency={shop?.currency || "CAD"}
                    handleSubscribe={handleSubscribe}
                    buttonDisabled={shop?.plan?.id === plan.id}
                  />
                ))
              ) : (
                <Text as="p" variant="bodyLg">
                  There are no plans in the database. Please make sure to add
                  plans using the API Playground. Since the database is split
                  between development and production, make sure to also add
                  plans to your production database once deploying and going
                  live.
                </Text>
              )
            ) : (
              <Spinner />
            )}
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopPage;
