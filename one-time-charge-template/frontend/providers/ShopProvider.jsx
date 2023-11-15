import { useFindFirst } from "@gadgetinc/react";
import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { trialCalculations } from "../utilities";
import { Box, Banner, Text, Spinner } from "@shopify/polaris";
import "./ShopProvider.css";
import BillingPage from "../BillingPage";

const BannerBox = ({ children }) => {
  return <Box id="bannerBox">{children}</Box>;
};

export const ShopContext = createContext({});

/**
 * @param { children: import("react").ReactNode } props The props passed to the React functional component
 *
 * React component that fetches shop and subscription data
 * Key features:
 *  - Get plan prices converted to the current shop's currency value
 *  - Sets the number of trial days left for this shop
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
        prices,
      }}
    >
      {show && (
        <BannerBox>
          <Banner
            title={bannerContext}
            tone="critical"
            onDismiss={handleDismiss}
          />
        </BannerBox>
      )}
      {!fetchingShop && !loading ? (
        !availableTrialDays && !shop?.oneTimeChargeId ? (
          <BillingPage />
        ) : (
          <>
            {availableTrialDays && (
              <BannerBox>
                <Banner
                  title="Welcome to the app! You are currently on a trial period."
                  tone="info"
                >
                  <Text as="p" variant="bodyMd">
                    The trial will end in <strong>{availableTrialDays}</strong>{" "}
                    days.
                  </Text>
                </Banner>
              </BannerBox>
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
