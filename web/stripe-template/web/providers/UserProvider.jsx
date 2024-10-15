import { useFindFirst } from "@gadgetinc/react";
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

  const [{ data: user, fetching, error }] = useFindFirst(api.user, {
    live: true,
    select: {
      stripeCustomerId: true,
      id: true,
    },
  });

  useEffect(() => {
    if (!user?.stripeCustomerId && !fetching) navigate("/billing");
  }, [user, fetching]);

  useEffect(() => {
    if (!fetching && error) console.error(error);
  }, [fetching, error]);

  if (fetching) {
    return <div>Loading...</div>;
  }

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
