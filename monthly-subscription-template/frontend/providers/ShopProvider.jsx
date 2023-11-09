import { useFindFirst, useGlobalAction } from "@gadgetinc/react";
import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { calculateTrialDays } from "../utilities";
import { Banner } from "@shopify/polaris";

export const ShopContext = createContext({});

export default ({ children }) => {
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const [trialDays, setTrialDays] = useState(0);
  const [prices, setPrices] = useState({});

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

  const [_, convertCurrency] = useGlobalAction(api.planCurrencyToShopCurrency);

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
      setTrialDays(
        calculateTrialDays(
          shop?.usedTrialDays,
          shop?.usedTrialDaysUpdatedAt,
          new Date(),
          shop?.plan?.trialDays
        ).availableTrialDays
      );
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
      const { data } = await convertCurrency();
      setPrices(data);
    };
    run();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        shop,
        fetchingShop,
        errorFetchingShop,
        trialDays,
        prices,
      }}
    >
      {show && (
        <Banner
          title={bannerContext}
          tone="critical"
          onDismiss={handleDismiss}
        />
      )}
      {children}
    </ShopContext.Provider>
  );
};
