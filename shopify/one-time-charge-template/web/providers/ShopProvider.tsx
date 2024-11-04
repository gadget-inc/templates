import { useFindFirst } from "@gadgetinc/react";
import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { trialCalculations } from "../utilities";
import { Banner, Text, Page } from "@shopify/polaris";
import BillingPage from "../routes/billing";
import { StyledSpinner } from "../components";

export type ShopContextType = {
  shop?: {
    id: string;
    currency: string;
    usedTrialMinutes: number;
    trialStartedAt: Date;
    oneTimeChargeId: string;
    trialDays: number;
  };
};

export const ShopContext = createContext({});

/**
 * React component that fetches shop data
 * Key features:
 *  - Fetch shop
 *  - Gate usage of the app if trial is over and merchant hasn't paid
 */
export default ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const [availableTrialDays, setAvailableTrialDays] = useState(0);
  const [loading, setLoading] = useState(true);

  // Note that we're using live queries here in case there's latency in updating the oneTimeChargeId field in the backend (on subscibe)
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

  if (fetchingShop || loading) {
    return <StyledSpinner />;
  }

  return (
    <ShopContext.Provider
      value={{
        shop,
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
      {!availableTrialDays && !shop?.oneTimeChargeId ? (
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
      )}
    </ShopContext.Provider>
  );
};
