import { useFindFirst } from "@gadgetinc/react";
import { createContext, useEffect } from "react";
import { api } from "../api";
import { Spinner } from "../components";

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
  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop, {
      select: {
        id: true,
        bundleCount: true,
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
