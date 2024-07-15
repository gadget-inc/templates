import { createContext, useCallback, useState } from "react";

export const ParamContext = createContext(null);

export default ({ children }) => {
  const [paramHistory, setParamHistory] = useState({});

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
