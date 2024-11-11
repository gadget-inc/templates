import { useFindFirst, useUser } from "@gadgetinc/react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useEffect } from "react";

type UserContextType = {
  user?: {
    id: string;
    stripeCustomerId: string | null;
  };
};

export const UserContext = createContext<UserContextType>({});

export default ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const userNonce = useUser();

  const [{ data: user, fetching, error }] = useFindFirst(api.user, {
    live: true,
    select: {
      stripeCustomerId: true,
      id: true,
    },
  });

  useEffect(() => {
    if (user && !user?.stripeCustomerId && !fetching) navigate("/billing");
  }, [user, fetching]);

  useEffect(() => {
    if (!fetching && error) console.error(error);
  }, [fetching, error]);

  if (userNonce && fetching) {
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
