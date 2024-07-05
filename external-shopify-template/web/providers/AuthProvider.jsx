import { useGlobalAction, useSession, useUser } from "@gadgetinc/react";
import { createContext, useEffect, useState } from "react";
import { api } from "../api";

export const AuthContext = createContext(null);

export default ({ children }) => {
  const user = useUser();
  const session = useSession();

  const [token, setToken] = useState();

  const [_, setCurrentSession] = useGlobalAction(api.setCurrentSession);

  // Need to find a way to user the token from the auth provider to set the user's shop record relationship
  // That needs to be done after sign in

  useEffect(() => {
    if (user && session) {
      setCurrentSession({
        sessionId: session.id,
        userId: user.id,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
