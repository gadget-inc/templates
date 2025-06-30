import { useFindFirst, useQuery } from "@gadgetinc/react";
import { createContext, useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { trialCalculations } from "../utilities";
import { Banner, Page, Text } from "@shopify/polaris";
import { StyledSpinner } from "../components";
import BillingPage from "../routes/billing";

export type ShopContextType = {
  shop?: {
    id?: string;
    currency?: string | null;
    usedTrialMinutes?: number | null;
    usedTrialMinutesUpdatedAt?: Date | null;
    plan?: {
      id?: string | null;
      name?: string | null;
      trialDays?: number | null;
    } | null;
  };
  gadgetMetadata?: {
    gadgetMeta?: {
      productionRenderURL: string;
      environmentName: string;
    };
  };
};

export const ShopContext = createContext<ShopContextType>({});

/**
 * React component that fetches shop and subscription data
 *
 * Key features:
 *  - Sets the number of trial days left for this shop
 *  - Allows children to access the context from this provider
 */
export default ({ children }: { children: React.ReactNode }) => {
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
          shop?.plan?.trialDays ?? 0
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
