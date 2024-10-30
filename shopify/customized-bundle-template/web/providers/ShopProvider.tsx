import { useFindFirst } from "@gadgetinc/react";
import { createContext, useEffect } from "react";
import { api } from "../api";
import { Spinner } from "../components";

export type ShopContextType =
  | { id?: string; bundleCount?: number | null; currency?: string | null }
  | undefined;

export const ShopContext = createContext({});

export default ({ children }: { children: React.ReactNode }) => {
  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop, {
      select: {
        id: true,
        bundleCount: true,
        currency: true,
      },
    });

  // useEffect for showing a banner if there's and error fetching shop information
  useEffect(() => {
    if (!fetchingShop && errorFetchingShop) {
      console.error(errorFetchingShop);
    }
  }, [fetchingShop, errorFetchingShop]);

  if (fetchingShop) {
    return <Spinner />;
  }

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
