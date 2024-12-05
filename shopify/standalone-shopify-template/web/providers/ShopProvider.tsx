import { createContext, useEffect } from "react";
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";

type ShopContextType = {
  shops?: {
    id: string;
    domain: string | null;
    shopOwner: string | null;
  }[];
};

export const ShopContext = createContext<ShopContextType>({});

export default ({ children }: { children: React.ReactNode }) => {
  // Fetch the shops linked to the user
  const [{ data: shops, fetching: fetchingShops, error: errorFetchingShops }] =
    useFindMany(api.shopifyShop, {
      live: true,
      select: {
        id: true,
        domain: true,
        shopOwner: true,
      },
    });

  // Log the error if there is one
  useEffect(() => {
    if (!fetchingShops && !errorFetchingShops) {
      console.log(errorFetchingShops);
    }
  }, [errorFetchingShops, fetchingShops]);

  return (
    <ShopContext.Provider value={{ shops }}>{children}</ShopContext.Provider>
  );
};
