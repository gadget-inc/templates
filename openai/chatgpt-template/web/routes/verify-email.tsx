import { api } from "../api";
import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAction, useAuth } from "@gadgetinc/react";
import { Button, Center, Text } from "@chakra-ui/react";

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
    return (
      <Center h="100vh">
        <Text color="red">{verifyEmailError.message}</Text>
      </Center>
    );
  }

  return data ? (
    <Center h="100vh">
      <Text color="green">
        Email has been verified successfully.
        <Link style={{ textDecoration: "none" }} to={configuration.signInPath}>
          <Button variant="link">Sign in now</Button>
        </Link>
      </Text>
    </Center>
  ) : null;
}
