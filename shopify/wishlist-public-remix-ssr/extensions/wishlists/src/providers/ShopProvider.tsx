import { useFindFirst } from "@gadgetinc/react";
import { createContext, useEffect } from "react";
import { api } from "../api";
import { StyledSpinner } from "../components";
import { GadgetRecord } from "@gadget-client/wishlist-public-remix-ssr";

type ShopContextType = {
  shop?: GadgetRecord<{
    id: string;
    domain: string | null;
    customers: {
      edges: {
        node: {
          id: string;
        };
      }[];
    };
  }>;
};

export const ShopContext = createContext<ShopContextType>({});

/**
 * React component that fetches shop and subscription data
 * Key features:
 * - Allows children to access the context from this provider
 * - Gives context to which shop and customer the extension is running for
 */
export default ({ children }: { children: React.ReactNode }) => {
  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop, {
      select: {
        id: true,
        domain: true,
        customers: {
          edges: {
            node: {
              id: true,
            },
          },
        },
      },
    });

  // useEffect for showing a banner if there's and error fetching shop information
  useEffect(() => {
    if (!fetchingShop && errorFetchingShop) {
      console.error(errorFetchingShop);
    }
  }, [fetchingShop, errorFetchingShop]);

  if (fetchingShop) {
    return <StyledSpinner />;
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
