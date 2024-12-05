import { useFindFirst, useMaybeFindFirst, useQuery } from "@gadgetinc/react";
import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { trialCalculations } from "../utilities";
import { Banner, Page, Text } from "@shopify/polaris";
import BillingPage from "../routes/billing";
import { StyledSpinner } from "../components";
import type { GadgetRecord } from "@gadget-client/usage-subscription-template";

type ShopContextType = {
  shop?: GadgetRecord<{
    id: string;
    currency: string | null;
    usedTrialMinutes: number;
    trialStartedAt: Date | null;
    plan: {
      id: string;
      name: string;
      trialDays: number;
    } | null;
  }>;
  currentCappedAmount?: number;
  gadgetMetadata?: {
    gadgetMeta: {
      productionRenderURL: string;
      environmentName: string;
    };
  };
};

type SubscriptionLineItems = {
  id: string;
  plan: {
    pricingDetails: {
      __typename: "AppUsagePricing";
      cappedAmount: {
        amount: string;
        currencyCode: string;
      };
      balanceUsed: {
        amount: string;
        currencyCode: string;
      };
      interval: string;
      terms: string;
    };
  };
}[];

export const ShopContext = createContext<ShopContextType>({});

/**
 * React component that fetches shop and subscription data
 * Key features:
 *  - Get plan prices converted to the current shop's currency value
 *  - Sets the number of trial days left for this shop
 *  - Fetches the current app subscription if one exists
 *  - Allows children to access the context from this provider
 */
export default ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  const [bannerContext, setBannerContext] = useState("");
  const [availableTrialDays, setAvailableTrialDays] = useState(0);
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
      data: gadgetMetadata,
      fetching: fetchingGadgetMetadata,
      error: errorFetchingGadgetMetadata,
    },
  ] = useQuery({
    query: `
        query { 
          gadgetMeta {
            productionRenderURL
            environmentName
          }
        }
      `,
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

  // Dismisses the error banner
  const handleDismiss = useCallback(() => {
    setShow(false);
  }, []);

  // useEffect for setting the number of trial days remaining for the current shop
  useEffect(() => {
    if (!fetchingShop && shop) {
      setAvailableTrialDays(
        trialCalculations(
          shop?.usedTrialMinutes,
          shop?.trialStartedAt as Date,
          new Date(),
          shop?.plan?.trialDays ?? 0
        ).availableTrialDays
      );
      setLoading(false);
    }
  }, [fetchingShop]);

  // useEffect for showing a banner if there's an error fetching shop information
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
      for (const lineItem of currentSubscription.lineItems as SubscriptionLineItems) {
        if (lineItem.plan?.pricingDetails?.__typename === "AppUsagePricing") {
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

  // useEffect showing an error in the console if there's an error fetching gadget metadata
  useEffect(() => {
    if (!fetchingGadgetMetadata && errorFetchingGadgetMetadata) {
      console.error(errorFetchingGadgetMetadata);
    }
  }, [fetchingGadgetMetadata, errorFetchingGadgetMetadata]);

  if (fetchingShop || fetchingGadgetMetadata || loading) {
    return (
      <Page>
        <StyledSpinner />
      </Page>
    );
  }

  return (
    <ShopContext.Provider
      value={{
        shop,
        currentCappedAmount,
        gadgetMetadata,
      }}
    >
      {show && (
        <Banner
          title={bannerContext}
          tone="critical"
          onDismiss={handleDismiss}
        />
      )}
      {!shop?.plan ? (
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
