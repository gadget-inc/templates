import { useFindFirst } from "@gadgetinc/react";
import { createContext, useEffect } from "react";
import { api } from "../api";

export const ShopContext = createContext(null);

export default ({ children }) => {
  const [{ data: shop, fetching: fetchingShop, error: errorFetchingShop }] =
    useFindFirst(api.shopifyShop);

  useEffect(() => {
    if (errorFetchingShop && !fetchingShop) {
      console.warn(errorFetchingShop);
    }
  }, [errorFetchingShop, fetchingShop]);

  return (
    <ShopContext.Provider value={{ shop, fetchingShop }}>
      {children}
    </ShopContext.Provider>
  );
};
