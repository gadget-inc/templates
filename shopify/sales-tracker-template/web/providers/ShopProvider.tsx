import { useFindFirst } from "@gadgetinc/react";
import { createContext, useEffect } from "react";
import { api } from "../api";
import StyledSpinner from "../components/StyledSpinner";
import {
  GadgetRecord,
  ShopifyShop,
} from "@gadget-client/sales-tracker-template";

export type ShopContextType = {
  shop?: GadgetRecord<{
    id: string;
    slackChannelId: string | null;
    hasSlackAccessToken: boolean | null;
  }>;
};

export const ShopContext = createContext<ShopContextType>({});

export default ({ children }: { children: React.ReactNode }) => {
  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop, {
      select: {
        id: true,
        slackChannelId: true,
        hasSlackAccessToken: true,
      },
    });

  if (fetchingShop) return <StyledSpinner />;

  useEffect(() => {
    if (!fetchingShop && errorFetchingShop) {
      console.error(errorFetchingShop);
    }
  }, [errorFetchingShop, fetchingShop]);

  return (
    <ShopContext.Provider
      value={{
        shop,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
