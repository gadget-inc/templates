import { api } from "../api";
import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAction, useAuth } from "@gadgetinc/react";

export default function () {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const [{ error: verifyEmailError, data }, verifyEmail] = useAction(api.user.verifyEmail);
  const verificationAttempted = useRef(false);
  const { configuration } = useAuth();

  useEffect(() => {
    if (!verificationAttempted.current) {
      code && verifyEmail({ code });
      verificationAttempted.current = true;
    }
  }, []);

  if (verifyEmailError) {
    return <p className="format-message error">{verifyEmailError.message}</p>;
  }

  return data ? (
    <p className="format-message success">
      Email has been verified successfully. <Link to={configuration.signInPath}>Sign in now</Link>
    </p>
  ) : null;
}
