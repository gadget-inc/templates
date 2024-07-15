import { createContext, useCallback, useState } from "react";

export const ParamContext = createContext(null);

export default ({ children }) => {
  const [paramHistory, setParamHistory] = useState({});

  /**
   * @param {string} token
   * Sets the token in the paramHistory state of the ParamProvider
   * The token is then using in the signed-in route if present in context
   */
  const applyParams = useCallback(
    (token) => {
      if (!token) {
        return;
      }

      setParamHistory({ ...paramHistory, token });
    },
    [paramHistory]
  );

  return (
    <ParamContext.Provider value={{ applyParams, paramHistory }}>
      {children}
    </ParamContext.Provider>
  );
};
