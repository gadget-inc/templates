import { createContext, useEffect } from "react";
import { api } from "../api";
import { useGlobalAction, useUser } from "@gadgetinc/react";
import type { GadgetRecord } from "@gadget-client/standalone-shopify-template";

type AuthContextType = {
  user?: GadgetRecord<Record<string, any>>;
};

export const AuthContext = createContext<AuthContextType>({});

export default ({ children }: { children: React.ReactNode }) => {
  const user = useUser() as unknown as
    | GadgetRecord<Record<string, any>>
    | undefined;

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
