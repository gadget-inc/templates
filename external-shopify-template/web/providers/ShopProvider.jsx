import { createContext, useEffect } from "react";
import { api } from "../api";
import { useFindMany } from "@gadgetinc/react";

export const ShopContext = createContext(null);

export default ({ children }) => {
  // Fetch the shops linked to the user
  const [{ data: shops, fetching: fetchingShops, error: errorFetchingShops }] =
    useFindMany(api.shopifyShop, {
      live: true,
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
