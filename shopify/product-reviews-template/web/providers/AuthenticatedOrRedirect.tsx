import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useOutletContext<{ isAuthenticated: boolean }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/expired");
  }, [isAuthenticated]);

  return isAuthenticated ? children : null;
};
