import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default ({ children }) => {
  const { isAuthenticated } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/expired");
  }, [isAuthenticated]);

  return isAuthenticated ? children : null;
};
