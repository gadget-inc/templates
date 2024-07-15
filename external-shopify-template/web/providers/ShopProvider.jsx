// import { useFindFirst } from "@gadgetinc/react";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";
import { AuthContext } from "./AuthProvider";

export const ShopContext = createContext(null);

export default ({ children }) => {
  const { user } = useContext(AuthContext);

  const [shop, setShop] = useState({ data: null, fetching: true, error: null });

  // This useEffect tries to fetch the user's shop
  useEffect(() => {
    if (user?.shopId) {
      const run = async () => {
        setShop(await api.shopifyShop.maybeFindFirst());
      };
      run();
    }
  }, [user?.shopId]);

  return (
    <ShopContext.Provider value={{ shop }}>{children}</ShopContext.Provider>
  );
};
