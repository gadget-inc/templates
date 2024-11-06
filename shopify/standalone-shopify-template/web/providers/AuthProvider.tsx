import { createContext, useEffect } from "react";
import { api } from "../api";
import { useGlobalAction, useUser } from "@gadgetinc/react";
import { GadgetRecord } from "@gadget-client/standalone-shopify-template";

export type AuthContextType = {
  user?: GadgetRecord<Record<string, any>>;
};

export const AuthContext = createContext<AuthContextType>({});

export default ({ children }: { children: React.ReactNode }) => {
  const user = useUser();

  console.log(user);

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
