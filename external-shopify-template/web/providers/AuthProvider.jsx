import { useGlobalAction, useSession, useUser } from "@gadgetinc/react";
import { createContext, useContext, useEffect } from "react";
import { api } from "../api";
import { useSearchParams } from "react-router-dom";
import { ParamContext } from "./ParamProvider";

export const AuthContext = createContext(null);

export default ({ children }) => {
  // Pulling the authToken from the URL query parameters
  const [params] = useSearchParams();
  // Fetching specific user data from the Gadget database using the @gadgetinc/react useUser hook
  const user = useUser(api, {
    select: {
      id: true,
      shopId: true,
      lastName: true,
      firstName: true,
      email: true,
      createdAt: true,
      googleImageUrl: true,
    },
  });
  const session = useSession();
  const { applyParams } = useContext(ParamContext);

  const [_, setCurrentSession] = useGlobalAction(api.setCurrentSession);

  useEffect(() => {
    if (user && session && !session?.user?.id) {
      setCurrentSession({
        sessionId: session.id,
        userId: user.id,
      });
    }
  }, []);

  // Setting params history on the ParamProvider in case the new user uses email/password login
  useEffect(() => {
    const authToken = params.get("authToken");

    applyParams(authToken);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
