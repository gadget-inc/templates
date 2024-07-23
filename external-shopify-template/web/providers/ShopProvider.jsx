import { createContext, useEffect } from "react";
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";

export const ShopContext = createContext(null);

export default ({ children }) => {
  const [{ data: shops, fetching: fetchingShops, error: errorFetchingShops }] =
    useFindMany(api.shopifyShop, {
      live: true,
    });

  useEffect(() => {
    if (!fetchingShops && !errorFetchingShops) {
      console.log(errorFetchingShops);
    }
  }, [errorFetchingShops, fetchingShops]);

  return (
    <ShopContext.Provider value={{ shops }}>{children}</ShopContext.Provider>
  );
};
