import { useUser } from "@gadgetinc/react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useEffect } from "react";

export const UserContext = createContext({});

/**
 * @param { children: import("react").ReactNode } props The props passed to the React functional component
 *
 * @returns { import("react").ReactElement } A React functional component
 */
export default ({ children }) => {
  const navigate = useNavigate();
  const user = useUser(api, { live: true });

  useEffect(() => {
    if (!user?.stripeCustomerId) navigate("/billing");
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
