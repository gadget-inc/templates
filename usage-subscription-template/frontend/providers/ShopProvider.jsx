import { useFindFirst, useMaybeFindFirst } from "@gadgetinc/react";
import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { trialCalculations } from "../utilities";
import { Banner, Page, Spinner, Text } from "@shopify/polaris";
import BillingPage from "../BillingPage";

export const ShopContext = createContext({});

/**
 * @param { children: import("react").ReactNode } props The props passed to the React functional component
 *
 * React component that fetches shop and subscription data
 * Key features:
 *  - Get plan prices converted to the current shop's currency value
 *  - Sets the number of trial days left for this shop
 *  - Fetches the current app subscription if one exists
 *  - Allows children to access the context from this provider
 *
 * @returns { import("react").ReactElement } A React functional component
 */
export default ({ children }) => {
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const [availableTrialDays, setAvailableTrialDays] = useState(0);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentCappedAmount, setCurrentCappedAmount] = useState(0);

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop, {
      select: {
        id: true,
        currency: true,
        usedTrialMinutes: true,
        trialStartedAt: true,
        plan: {
          id: true,
          name: true,
          trialDays: true,
        },
      },
    });

  const [
    {
      data: currentSubscription,
      fetching: fetchingCurrentSubscription,
      error: errorFetchingCurrentSubscription,
    },
  ] = useMaybeFindFirst(api.shopifyAppSubscription, {
    select: {
      lineItems: true,
    },
    filter: {
      status: {
        equals: "ACTIVE",
      },
    },
  });

  /**
   * @type { () => void }
   *
   * Dismisses the error banner
   */
  const handleDismiss = useCallback(() => {
    setShow(false);
  }, []);

  // useEffect for setting the number of trial days remaining for the current shop
  useEffect(() => {
    if (!fetchingShop && shop) {
      setAvailableTrialDays(
        trialCalculations(
          shop?.usedTrialMinutes,
          shop?.trialStartedAt,
          new Date(),
          shop?.plan?.trialDays
        ).availableTrialDays
      );
      setLoading(false);
    }
  }, [fetchingShop]);

  // useEffect for showing a banner if there's and error fetching shop information
  useEffect(() => {
    if (!fetchingShop && errorFetchingShop) {
      setBannerContext(errorFetchingShop.message);
      setShow(true);
    } else if (fetchingShop) {
      setShow(false);
    }
  }, [fetchingShop, errorFetchingShop]);

  // useEffect for fetching the cappedAmount set by the active subscription record for this shop
  useEffect(() => {
    if (!fetchingCurrentSubscription && currentSubscription) {
      for (const lineItem of currentSubscription.lineItems) {
        if (lineItem.plan.pricingDetails.__typename === "AppUsagePricing") {
          setCurrentCappedAmount(
            parseFloat(lineItem.plan.pricingDetails.cappedAmount.amount)
          );
          break;
        }
      }
    }
  }, [fetchingCurrentSubscription]);

  // useEffect for showing a banner if there's and error fetching current subscription
  useEffect(() => {
    if (!fetchingCurrentSubscription && errorFetchingCurrentSubscription) {
      setBannerContext(errorFetchingCurrentSubscription.message);
      setShow(true);
    } else if (fetchingCurrentSubscription) {
      setShow(false);
    }
  }, [fetchingCurrentSubscription, errorFetchingCurrentSubscription]);

  // useEffect for calling the planCurrencyToShopCurrency global action - getting all the currency conversions for plans
  useEffect(() => {
    const run = async () => {
      setPrices(await api.planCurrencyToShopCurrency());
    };
    run();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        shop,
        fetchingShop,
        errorFetchingShop,
        availableTrialDays,
        prices,
        currentCappedAmount,
      }}
    >
      {show && (
        <Banner
          title={bannerContext}
          tone="critical"
          onDismiss={handleDismiss}
        />
      )}
      {!fetchingShop && !loading ? (
        !!availableTrialDays && !shop?.plan ? (
          <>
            <Page>
              <Banner tone="warning" title="Action required">
                <Text as="p" variant="bodyMd">
                  You must select a plan before you can access this application.
                </Text>
              </Banner>
            </Page>
            <BillingPage />
          </>
        ) : (
          <>
            {!!availableTrialDays && (
              <Page>
                <Banner
                  title="You are currently on a trial period."
                  tone="info"
                >
                  <Text as="p" variant="bodyMd">
                    The trial will end in <strong>{availableTrialDays}</strong>{" "}
                    days.
                  </Text>
                </Banner>
              </Page>
            )}
            {children}
          </>
        )
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Spinner accessibilityLabel="Spinner example" size="large" />
        </div>
      )}
    </ShopContext.Provider>
  );
};
