import { useFindFirst } from "@gadgetinc/react";
import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { trialCalculations } from "../utilities";
import { Banner, Page, Text } from "@shopify/polaris";
import { StyledSpinner } from "../components";
import BillingPage from "../BillingPage";

export const ShopContext = createContext({});

/**
 * @param { children: import("react").ReactNode } props The props passed to the React functional component
 *
 * React component that fetches shop and subscription data
 * Key features:
 *  - Sets the number of trial days left for this shop
 *  - Allows children to access the context from this provider
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
        usedTrialMinutesUpdatedAt: true,
        plan: {
          id: true,
          name: true,
          trialDays: true,
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
          shop?.usedTrialMinutesUpdatedAt,
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
        <Banner
          title={bannerContext}
          tone="critical"
          onDismiss={handleDismiss}
        />
      )}
      {!!availableTrialDays && !shop?.plan ? (
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
              <Banner title="You are currently on a trial period." tone="info">
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
