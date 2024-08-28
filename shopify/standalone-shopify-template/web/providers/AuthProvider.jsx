import { createContext, useEffect } from "react";
import { api } from "../api";
import { useGlobalAction, useUser } from "@gadgetinc/react";

export const AuthContext = createContext(null);

export default ({ children }) => {
  const user = useUser();

  const [_, verifyConnections] = useGlobalAction(api.verifyConnections);

  // Check if there should be a new connection between the user and a shop
  useEffect(() => {
    if (user) {
      const run = async () => {
        await verifyConnections();
      };

      run();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
