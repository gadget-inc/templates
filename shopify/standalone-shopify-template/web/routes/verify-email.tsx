import { api } from "../api";
import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAction, useAuth } from "@gadgetinc/react";
import { Text } from "@shopify/polaris";

export default function () {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const [{ error: verifyEmailError, data }, verifyEmail] = useAction(
    api.user.verifyEmail
  );
  const verificationAttempted = useRef(false);
  const { configuration } = useAuth();

  useEffect(() => {
    if (!verificationAttempted.current) {
      code && verifyEmail({ code });
      verificationAttempted.current = true;
    }
  }, []);

  if (verifyEmailError) {
    return <Text as="p">{verifyEmailError.message}</Text>;
  }

  return data ? (
    <Text as="p">
      Email has been verified successfully.{" "}
      <Link to={configuration.signInPath}>Sign in now</Link>
    </Text>
  ) : null;
}
