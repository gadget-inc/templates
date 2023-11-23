import { useFindFirst, useMaybeFindFirst } from "@gadgetinc/react";
import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { trialCalculations } from "../utilities";
import { Banner, Text, Spinner, Page } from "@shopify/polaris";
import BillingPage from "../BillingPage";

export const ShopContext = createContext({});

/**
 * @param { children: import("react").ReactNode } props The props passed to the React functional component
 *
 * React component that fetches shop data
 * Key features:
 *  - Fetch shop
 *  - Gate usage of the app if trial is over and merchant hasn't paid
 *
 * @returns { import("react").ReactElement } A React functional component
 */
export default ({ children }) => {
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const [availableTrialDays, setAvailableTrialDays] = useState(0);
  const [loading, setLoading] = useState(true);

  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop, {
      select: {
        id: true,
        currency: true,
        usedTrialMinutes: true,
        trialStartedAt: true,
        oneTimeChargeId: true,
        trialDays: true,
      },
      live: true,
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
          shop?.trialDays
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

  return (
    <ShopContext.Provider
      value={{
        shop,
        fetchingShop,
        errorFetchingShop,
      }}
    >
      {show && (
        <Page>
          <Banner
            title={bannerContext}
            tone="critical"
            onDismiss={handleDismiss}
          />
        </Page>
      )}
      {!fetchingShop && !loading ? (
        !availableTrialDays && !shop?.oneTimeChargeId ? (
          <BillingPage />
        ) : (
          <>
            {!!availableTrialDays && (
              <Page>
                <Banner
                  title="Welcome to the app! You are currently on a trial period."
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
