import { useFindFirst } from "@gadgetinc/react";
import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { calculateTrialDays } from "../utilities";
import { Banner } from "@shopify/polaris";

export const ShopContext = createContext({});

export default ({ children }) => {
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

  const handleDismiss = useCallback(() => {
    setShow(false);
  }, []);

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
        trialDays,
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
