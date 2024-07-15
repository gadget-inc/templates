import { useGlobalAction, useSession, useUser } from "@gadgetinc/react";
import { createContext, useContext, useEffect } from "react";
import { api } from "../api";
import { useSearchParams } from "react-router-dom";
import { ParamContext } from "./ParamProvider";

export const AuthContext = createContext(null);

export default ({ children }) => {
  // Pulling the authToken from the URL query parameters
  const [params] = useSearchParams();
  // Fetching specific user data
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
    if (user && session) {
      setCurrentSession({
        sessionId: session.id,
        userId: user.id,
      });
    }
  }, [user]);

  useEffect(() => {
    const authToken = params.get("authToken");

    applyParams(authToken);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
